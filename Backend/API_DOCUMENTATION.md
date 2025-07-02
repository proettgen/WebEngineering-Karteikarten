# API Documentation Workflow

## Overview
This project uses automated Swagger/OpenAPI documentation generation from JSDoc comments in the source code. This ensures the API documentation is always up-to-date and synchronized with the actual implementation.

##  Quick Start for Team Members

### 1. Document Your API Endpoints
Add JSDoc comments with `@swagger` annotations directly above your route definitions:

```typescript
/**
 * @swagger
 * /api/cards:
 *   post:
 *     summary: Create a new flashcard
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, question, answer, folderId]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "JavaScript Closures"
 *               question:
 *                 type: string
 *                 example: "What is a closure?"
 *               answer:
 *                 type: string
 *                 example: "A function with access to outer variables"
 *               folderId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Card created successfully
 *       400:
 *         description: Invalid input data
 */
router.post('/cards', cardController.createCard);
```

### 2. Generate Documentation
Before every commit and deployment:

```bash
npm run generate-swagger
```

This creates `src/config/generated-swagger.json` which must be committed to version control.

### 3. View Documentation
- **Local Development**: http://localhost:3001/api/docs
- **Production**: https://petstore.swagger.io/?url=https://web-engineering-karteikarten.vercel.app/api/api-docs/swagger.json

##  Workflow Rules

###  DO:
- Write JSDoc comments directly above route definitions
- Use consistent 2-space indentation in YAML
- Run `npm run generate-swagger` before every commit
- Commit the generated `generated-swagger.json` file
- Provide realistic examples for all properties
- Document all common error responses (400, 404, 500)

###  DON'T:
- Write JSDoc above controller functions (put it above routes!)
- Use tabs for indentation in YAML (spaces only!)
- Forget to commit the generated swagger file
- Skip the generation step before deployment

##  Troubleshooting

### Script Fails with Syntax Error
**Cause**: Invalid YAML syntax in JSDoc comments
**Solution**: Check indentation (use spaces, not tabs) and proper YAML formatting

### Documentation Not Updating
**Cause**: Forgot to run generation script
**Solution**: Always run `npm run generate-swagger` before deployment

### Missing Endpoints in Documentation
**Cause**: JSDoc not placed correctly
**Solution**: Ensure `@swagger` JSDoc is directly above route definition, not controller

### Vercel Doesn't Serve Updated Docs
**Cause**: Generated file not committed
**Solution**: Commit `generated-swagger.json` and redeploy

##  Important Files

| File | Purpose | Action Required |
|------|---------|-----------------|
| `src/routes/*.ts` | Source code with JSDoc | ✏️ Write/update JSDoc comments |
| `src/config/generated-swagger.json` | Generated docs | ✅ Commit to version control |
| `src/config/staticSwagger.ts` | Fallback docs | 🔄 Backup (rarely modified) |
| `scripts/generateSwagger.ts` | Generator script | 🛠️ Run before deployment |
| `api/index.ts` | API server | 🌐 Serves docs at `/api/api-docs/swagger.json` |

##  Benefits

1. **Always Up-to-Date**: Documentation generated from actual code
2. **Team Friendly**: Simple JSDoc comments in familiar format
3. **Vercel Compatible**: Static files work with serverless deployment
4. **Version Controlled**: Documentation changes tracked with code changes
5. **Professional**: Clean, interactive Swagger UI for API consumers

##  Advanced Usage

### Custom Schemas
Reference shared schemas in your JSDoc:

```yaml
schema:
  $ref: '#/components/schemas/Card'
```

### Complex Request Bodies
Document nested objects and arrays:

```yaml
requestBody:
  content:
    application/json:
      schema:
        type: object
        properties:
          cards:
            type: array
            items:
              $ref: '#/components/schemas/Card'
```

### Authentication (Future)
When authentication is added, document it like this:

```yaml
security:
  - bearerAuth: []
```

##  Pre-Deployment Checklist

Before every deployment to Vercel:

- [ ] Updated JSDoc comments for all changed/new endpoints
- [ ] Ran `npm run generate-swagger` successfully
- [ ] Committed `generated-swagger.json` file
- [ ] Tested documentation locally at `/api/docs`
- [ ] Verified all endpoint examples work
- [ ] Pushed changes to repository

##  Tips for Better Documentation

1. **Be Specific**: Use concrete examples instead of generic ones
2. **Cover Edge Cases**: Document error conditions and validation rules
3. **Use Consistent Naming**: Follow the same patterns across all endpoints
4. **Include Descriptions**: Explain what each endpoint does and when to use it
5. **Test Your Examples**: Ensure all examples in docs actually work

##  Useful Links

- [OpenAPI 3.0 Specification](https://swagger.io/specification/)
- [Swagger Editor](https://editor.swagger.io/) - Test your YAML syntax
- [JSDoc Documentation](https://jsdoc.app/) - JSDoc comment format
- [Swagger UI](https://swagger.io/tools/swagger-ui/) - Interactive documentation

---
