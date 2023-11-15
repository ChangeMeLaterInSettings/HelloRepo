# Commits

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Commit Standards](#commit-standards)
    - [Structure of a Commit Message](#structure-of-a-commit-message)
    - [Tag Types](#tag-types) 

---

## Commit Standards

### Structure of a Commit Message
```
git commit -m "<tag_type>(scope): <message>"
```

Here are some examples:

- `feat: User login`
- `update(componentFoo): add User auth API client`
- `fix(site): Logo no longer disappears on smaller screen sizes`
- `style: treat eslint errors`
- `docs: update README`


### Tag Types
The following words should be used to tag commits. This is by no means an exhaustive list so if you find that another tag word fits better, please feel free to use it.

- **build**: Changes that affect how the project is built or change its dependencies
- **feat**: A new feature or completion of a new feature. May be used in place of `update`
- **update**: Any work that leads to completion of a task, finding a solution to a bug, etc. May be used in place of `feat`
- **docs**: Updates to documentation, such as comments, Markdown files, etc.
- **fix**: Bug fixes
- **refactor**: A code change that does not change how the code works
- **perf**: Changes that improve the efficiency or performance of the code
- **style**: Code style changes, such as white-space, formatting, linting fixes, etc.
- **test**: Addition of automated tests or updating existing tests
