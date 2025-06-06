# Webanwendungen - Developer Portfolio

## Deadlines:

- Wichtigste Funktionen (Trennung & CV): 06.07.2025
- Code Fertig: 10.08.2025
- Doku fertig: 22.08.2025

## Technologies Used

- [Vite](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/frontio-ai/vite-template.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed
correctly.

### Generate dependency graph

Madge is included to visualize module dependencies and compute simple metrics. Run the following command to generate an
SVG graph and metrics file under `docs/`:

```bash
npm run deps:madge
```

This creates `docs/dependency-graph.svg` and `docs/dependency-metrics.json` with coupling and cohesion values for each
module.
The generated files are excluded from version control via `.gitignore`.
Make sure [Graphviz](https://graphviz.org/download/) is installed locally so Madge can create the SVG image.

## License

Licensed under the [MIT license](https://github.com/frontio-ai/vite-template/blob/main/LICENSE).
