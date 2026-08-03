# FunkFit Builder v0.7.4-alpha.10

## Kritisk opstartsrettelse

- Rettet `ReferenceError: Cannot access 'read' before initialization`.
- `read()` oprettes nu, før udstyrsprofilen indlæses.
- Appens JavaScript kan derfor gennemføre opstarten.
- Knapper, navigation, Builder, AI-flow og dialoger kan igen få deres event handlers.
- Cache- og versionsreferencer er opdateret.
