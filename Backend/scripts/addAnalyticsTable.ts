import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

const sql = neon(connectionString);

async function addAnalyticsTable() {
  try {
    console.log('Checking if analytics table exists...');
    
    // Check if analytics table exists
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'analytics'
      );
    `;

    if (tableExists[0].exists) {
      console.log('Analytics table already exists.');
      
      // Check if userId column exists
      const userIdExists = await sql`
        SELECT EXISTS (
          SELECT FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = 'analytics'
          AND column_name = 'user_id'
        );
      `;

      if (!userIdExists[0].exists) {
        console.log('Adding user_id column to analytics table...');
        await sql`
          ALTER TABLE analytics 
          ADD COLUMN user_id UUID;
        `;
        
        console.log('Adding foreign key constraint...');
        await sql`
          ALTER TABLE analytics 
          ADD CONSTRAINT analytics_user_id_users_id_fk 
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
        `;
        
        console.log('user_id column and foreign key added successfully.');
      } else {
        console.log('user_id column already exists.');
      }
    } else {
      console.log('Creating analytics table...');
      await sql`
        CREATE TABLE analytics (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL,
          study_session INTEGER NOT NULL,
          total_cards INTEGER NOT NULL DEFAULT 0,
          correct_answers INTEGER NOT NULL DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
          CONSTRAINT analytics_user_id_users_id_fk 
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
      `;
      console.log('Analytics table created successfully.');
    }

    console.log('Analytics table setup completed.');
  } catch (error) {
    console.error('Error setting up analytics table:', error);
    throw error;
  }
}

addAnalyticsTable().catch(console.error);
