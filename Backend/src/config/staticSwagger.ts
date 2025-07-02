// Statische Swagger-Spezifikation für Vercel
export const staticSwaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'WebEngineering Karteikarten API',
    version: '1.0.0',
    description: 'Eine REST API für die Verwaltung von Karteikarten und Ordnern',
    contact: {
      name: 'API Support',
      email: 'support@karteikarten-app.com',
    },
  },
  servers: [
    {
      url: 'https://web-engineering-karteikarten.vercel.app',
      description: 'Production server (Vercel)',
    },
    {
      url: 'http://localhost:3001',
      description: 'Development server',
    },
  ],
  paths: {
    '/api/cards': {
      get: {
        summary: 'Alle Karten mit erweiterten Filter- und Sortieroptionen abrufen',
        description: 'Durchsucht alle Karten systemweit mit verschiedenen Filteroptionen',
        tags: ['Cards'],
        parameters: [
          {
            in: 'query',
            name: 'folderId',
            schema: { type: 'string', format: 'uuid' },
            description: 'Filter nach spezifischem Ordner'
          },
          {
            in: 'query',
            name: 'tags',
            schema: { type: 'string' },
            description: 'Filter nach Tags (kommagetrennt)',
            example: 'javascript,frontend'
          },
          {
            in: 'query',
            name: 'title',
            schema: { type: 'string' },
            description: 'Filter nach Titel (partielle Übereinstimmung)'
          },
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            description: 'Anzahl der Karten pro Seite'
          },
          {
            in: 'query',
            name: 'offset',
            schema: { type: 'integer', minimum: 0, default: 0 },
            description: 'Anzahl der zu überspringenden Karten für Paginierung'
          },
          {
            in: 'query',
            name: 'sortBy',
            schema: { type: 'string', enum: ['createdAt', 'currentLearningLevel'] },
            description: 'Feld nach dem sortiert werden soll'
          },
          {
            in: 'query',
            name: 'order',
            schema: { type: 'string', enum: ['asc', 'desc'] },
            description: 'Sortierreihenfolge'
          }
        ],
        responses: {
          200: {
            description: 'Liste der gefilterten Karten',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        cards: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Card' }
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            limit: { type: 'integer' },
                            offset: { type: 'integer' },
                            total: { type: 'integer' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Ungültige Parameter',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      post: {
        summary: 'Neue Karte erstellen',
        description: 'Erstellt eine neue Karteikarte und ordnet sie einem Ordner zu',
        tags: ['Cards'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'question', 'answer', 'folderId'],
                properties: {
                  title: {
                    type: 'string',
                    description: 'Titel der Karte',
                    example: 'JavaScript Closures'
                  },
                  question: {
                    type: 'string',
                    description: 'Frage auf der Vorderseite',
                    example: 'Was ist ein Closure in JavaScript?'
                  },
                  answer: {
                    type: 'string',
                    description: 'Antwort auf der Rückseite',
                    example: 'Ein Closure ist eine Funktion, die Zugriff auf Variablen aus ihrem äußeren Scope hat...'
                  },
                  folderId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID des zugehörigen Ordners'
                  },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Tags zur Kategorisierung',
                    example: ['javascript', 'closures', 'functions']
                  },
                  currentLearningLevel: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 5,
                    default: 1,
                    description: 'Aktuelles Lernniveau (1-5)'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Karte erfolgreich erstellt',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        card: { $ref: '#/components/schemas/Card' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Ungültige Eingabedaten',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/api/cards/{id}': {
      get: {
        summary: 'Einzelne Karte abrufen',
        description: 'Lädt eine spezifische Karte anhand ihrer ID',
        tags: ['Cards'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Eindeutige ID der Karte'
          }
        ],
        responses: {
          200: {
            description: 'Karte erfolgreich geladen',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        card: { $ref: '#/components/schemas/Card' }
                      }
                    }
                  }
                }
              }
            }
          },
          404: {
            description: 'Karte nicht gefunden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      put: {
        summary: 'Karte aktualisieren',
        description: 'Aktualisiert eine bestehende Karte (partielle Updates möglich)',
        tags: ['Cards'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Eindeutige ID der Karte'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string', description: 'Neuer Titel der Karte' },
                  question: { type: 'string', description: 'Neue Frage' },
                  answer: { type: 'string', description: 'Neue Antwort' },
                  folderId: { type: 'string', format: 'uuid', description: 'Neue Ordner-ID' },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Neue Tags'
                  },
                  currentLearningLevel: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 5,
                    description: 'Neues Lernniveau'
                  }
                },
                example: {
                  title: 'JavaScript Closures - Erweitert',
                  currentLearningLevel: 3,
                  tags: ['javascript', 'closures', 'advanced']
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Karte erfolgreich aktualisiert',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        card: { $ref: '#/components/schemas/Card' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: {
            description: 'Ungültige Eingabedaten',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          },
          404: {
            description: 'Karte nicht gefunden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      },
      delete: {
        summary: 'Karte löschen',
        description: 'Löscht eine Karte dauerhaft aus dem System',
        tags: ['Cards'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'Eindeutige ID der zu löschenden Karte'
          }
        ],
        responses: {
          204: { description: 'Karte erfolgreich gelöscht' },
          404: {
            description: 'Karte nicht gefunden',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' }
              }
            }
          }
        }
      }
    },
    '/api/folders': {
      get: {
        summary: 'Alle Ordner mit Paginierung abrufen',
        description: 'Lädt alle verfügbaren Ordner mit optionaler Paginierung',
        tags: ['Folders'],
        parameters: [
          {
            in: 'query',
            name: 'limit',
            schema: { type: 'integer', minimum: 1, maximum: 100, default: 20 },
            description: 'Anzahl der Ordner pro Seite'
          },
          {
            in: 'query',
            name: 'offset',
            schema: { type: 'integer', minimum: 0, default: 0 },
            description: 'Anzahl der zu überspringenden Ordner für Paginierung'
          }
        ],
        responses: {
          200: {
            description: 'Liste aller Ordner',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        folders: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Folder' }
                        },
                        pagination: {
                          type: 'object',
                          properties: {
                            limit: { type: 'integer' },
                            offset: { type: 'integer' },
                            total: { type: 'integer' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Neuen Ordner erstellen',
        description: 'Erstellt einen neuen Ordner (kann auch Unterordner sein)',
        tags: ['Folders'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: {
                    type: 'string',
                    description: 'Name des Ordners',
                    example: 'JavaScript Grundlagen'
                  },
                  parentId: {
                    type: 'string',
                    format: 'uuid',
                    description: 'ID des übergeordneten Ordners (optional für Unterordner)',
                    nullable: true
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Ordner erfolgreich erstellt',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        folder: { $ref: '#/components/schemas/Folder' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/folders/{id}/cards': {
      get: {
        summary: 'Alle Karten in einem Ordner abrufen',
        description: 'Lädt alle Karteikarten, die einem spezifischen Ordner zugeordnet sind',
        tags: ['Folders', 'Cards'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID des Ordners'
          }
        ],
        responses: {
          200: {
            description: 'Liste der Karten im Ordner',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        cards: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/Card' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Neue Karte in einem Ordner erstellen',
        description: 'Erstellt eine neue Karteikarte und ordnet sie automatisch dem angegebenen Ordner zu',
        tags: ['Folders', 'Cards'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string', format: 'uuid' },
            description: 'ID des Ordners, dem die Karte zugeordnet wird'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title', 'question', 'answer'],
                properties: {
                  title: {
                    type: 'string',
                    description: 'Titel der Karte',
                    example: 'React Hooks'
                  },
                  question: {
                    type: 'string',
                    description: 'Frage auf der Vorderseite',
                    example: 'Was ist der Unterschied zwischen useState und useEffect?'
                  },
                  answer: {
                    type: 'string',
                    description: 'Antwort auf der Rückseite',
                    example: 'useState verwaltet lokalen State, useEffect führt Seiteneffekte aus...'
                  },
                  tags: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Tags zur Kategorisierung',
                    example: ['react', 'hooks', 'frontend']
                  },
                  currentLearningLevel: {
                    type: 'integer',
                    minimum: 1,
                    maximum: 5,
                    default: 1,
                    description: 'Aktuelles Lernniveau (1-5)'
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Karte erfolgreich im Ordner erstellt',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        card: { $ref: '#/components/schemas/Card' }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      Card: {
        type: 'object',
        required: ['title', 'question', 'answer', 'folderId'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Eindeutige ID der Karteikarte',
            example: '1a2b3c4d-5e6f-47ab-8c9d-0e1f2a3b4c5a'
          },
          title: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            description: 'Titel der Karteikarte',
            example: 'JavaScript Closures'
          },
          question: {
            type: 'string',
            minLength: 1,
            maxLength: 2000,
            description: 'Frage der Karteikarte',
            example: 'Was ist eine Closure in JavaScript?'
          },
          answer: {
            type: 'string',
            minLength: 1,
            maxLength: 2000,
            description: 'Antwort der Karteikarte',
            example: 'Eine Closure ist eine Funktion, die Zugriff auf Variablen aus ihrem äußeren Scope hat.'
          },
          currentLearningLevel: {
            type: 'integer',
            minimum: 0,
            maximum: 5,
            description: 'Aktueller Lernlevel (0-5)',
            example: 2
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Erstellungsdatum',
            example: '2024-05-01T08:00:00.000Z'
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            nullable: true,
            description: 'Tags zur Kategorisierung',
            example: ['javascript', 'frontend', 'advanced']
          },
          folderId: {
            type: 'string',
            format: 'uuid',
            description: 'ID des zugehörigen Ordners',
            example: 'c6f8fb2b-a33f-46da-941d-9832b6212395'
          }
        }
      },
      Folder: {
        type: 'object',
        required: ['name'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            description: 'Eindeutige ID des Ordners',
            example: 'c6f8fb2b-a33f-46da-941d-9832b6212395'
          },
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            description: 'Name des Ordners',
            example: 'JavaScript Grundlagen'
          },
          parentId: {
            type: 'string',
            format: 'uuid',
            nullable: true,
            description: 'ID des übergeordneten Ordners',
            example: 'parent-folder-uuid'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Erstellungsdatum',
            example: '2024-05-01T08:00:00.000Z'
          },
          lastOpenedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Letztes Öffnungsdatum',
            example: '2024-05-15T14:30:00.000Z'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          status: {
            type: 'string',
            example: 'error'
          },
          message: {
            type: 'string',
            example: 'Validation failed'
          },
          errors: {
            type: 'array',
            items: { type: 'string' },
            example: ['Title must not be empty']
          }
        }
      }
    }
  }
};
