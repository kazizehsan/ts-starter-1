# Guidelines
## Coding conventions
* `*.interfaces.ts` should not contain any low-level implementation details.
    * For example, `user.interfaces.ts` contains the high-level `IUserBaseModel` interface but no database-specific (mongoose) details.
    * One way to uphold this rule is by avoiding `import` statements from low-level packages in such `*.interfaces.ts` files.
* `*.service.ts` function signatures should not contain low-level objects.
    * Function inputs and return types should only use high-level objects such as interfaces from `*.interfaces.ts` files.
    * The body of the function can contain references to low-level objects.
* `*.controller.ts` function signatures should not contain low-level objects.
    * Function inputs and return types should only use high-level objects such as interfaces from `*.interfaces.ts` files.
    * The body of the function can contain references to low-level objects, but should be avoided if possible.
* Logging. Responses are automatically logged by `morgan` middlewares with the help of `winston`. Errors are logged automatically by the global `errorHandler` in `src/modules/errors/error.ts`. So, there is usually no need to manually log anything unless we are trying to observe something specific.