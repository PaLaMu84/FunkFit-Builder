# FunkFit Builder v0.7.4-alpha.39

## Kritisk cache-fix
- Rettet mismatch hvor UI viste 13 fælles lege, men browseren stadig hentede de 8 fra alpha.37.
- `sharedGames.json` bruger nu versionsparameter fra APP_VERSION.
- Fetch bruger `cache: no-store`.
- Service worker bruger network-first for sharedGames.
- Administration viser faktisk status: fx “✓ 13/13 indlæst”.

## Fælles lege
De 5 publicerede brugerlege fra alpha.38 er fortsat bundlet. sharedGames.json indeholder 13 lege i alt.

## Data
Workout/game storage keys er uændrede.
