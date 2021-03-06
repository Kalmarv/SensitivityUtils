# Sensitivity Utils

<br>
<p align="center">
  <img width="200" height="200" src="https://raw.githubusercontent.com/Kalmarv/SensitivityUtils/master/public/assets/pictures/android-chrome-512x512.png">
</p>
<h2 align="center">A collection of calulators for FPS games</h2>
<br>

## Getting Started

You can visit the site at [sens.kalmarv.xyz](https://sens.kalmarv.xyz/)

### Running Locally

If you want to install and run locally you'll need [Node.js](https://nodejs.org/) and [Git](https://git-scm.com/) installed.

```console
git clone https://github.com/Kalmarv/SensitivityUtils
cd SensitivityUtils
npm install
npm run dev
```

### Host on Vercel

If you wish to host the site yourself, you can simply click the button below

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FKalmarv%2FSensitivityUtils)

## Running the tests

Unit tests cover every function involved in the sensitivity calculations.

End-to-end tests cover the functionality of every page.

### Unit Tests

```console
npm run test:unit
```

### End-to-End Tests

```console
npm run dev
npm run test:e2e
```

E2E tests run headless by default, to test in a real browser, run the following

```console
npx playwright test --headed
```

## Built With

- [React](https://reactjs.org/) - The web framework used
- [TypeScript](https://www.typescriptlang.org/) - For types, unsurprisingly
- [TailwindCSS](https://tailwindcss.com/) - Styling
- [DaisyUI](https://daisyui.com/) - Tailwind Components
- [Vite](https://vitejs.dev/) - Build tooling
- [Vitest](https://vitest.dev/) - Unit testing
- [Playwright](https://playwright.dev/) - End-to-end testing

## Perfomance

Perfect scores in lighthouse for all categories

<p align="center">
  <img src="https://raw.githubusercontent.com/Kalmarv/SensitivityUtils/master/public/assets/pictures/lighthouseSensitivityUtils.png">
</p>

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE) file for details
