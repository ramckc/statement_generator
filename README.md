# Subdocument Array Mutation - Prompt

AspireIQ uses a document database (amongst other storage solutions) to store
high volume application data. Often, the application needs to manage an array of
objects (i.e. posts, mentions) which get stored as properties of a root JSON
document. For example, a content creator on the AspireIQ platform can be
responsible for producing social posts as part of their relationship with the
brands.

### Instalattion
Requires [Node.js](https://nodejs.org/) to run.

The application does not have any dev dependencies so just start the application.

```sh
$ cd statement_generator
$ node .
```

The application runs a series of example queries located in the index.js and the workload of the application happens in the StatementGenerator.js file.
