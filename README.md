<div align="center"><strong>This document serves as an assessment for a job application as Senior Frontend Developer at SMARTM2M Indonesia (part of SMARTM2M CO., LTD – South Korea). <br/> Developed by Bhaktiaji Ilham.</strong></div>

<div align="center">Built with the Next.js TypeScript Tailwind</div>

<div align="center"><a href="https://smartm-2-m-assesment-bhaktiaji-ilham-mabruri.vercel.app/">Demo</a></div>

## Overview

Frontend Stack:

- Framework - [Next.js 14](https://nextjs.org/13)
- Language - [TypeScript](https://www.typescriptlang.org)
- Styling - [Tailwind CSS](https://tailwindcss.com)
- UI Components - [Shadcn-ui](https://ui.shadcn.com)
- Schema Validations - [Zod](https://zod.dev)
- State Management - [Zustand](https://zustand-demo.pmnd.rs)
- Search params state manager - [Nuqs](https://nuqs.47ng.com/)
- Auth - [Auth.js](https://authjs.dev/)
- Tables - [Tanstack Tables](https://ui.shadcn.com/docs/components/data-table)
- Forms - [React Hook Form](https://ui.shadcn.com/docs/components/form)
- Command+k interface - [kbar](https://kbar.vercel.app/)
- Linting - [ESLint](https://eslint.org)
- Pre-commit Hooks - [Husky](https://typicode.github.io/husky/)
- Formatting - [Prettier](https://prettier.io)


## Pages

1. [Signup] : Authentication with **NextAuth** supports email logins (Just hit my demo email for login).  

2. [Dashboard] : Cards with recharts graphs for analytics.                                                               

3. [Employee] : Tanstack tables with server side searching, filter, pagination by Nuqs which is a Type-safe search params state manager in Nextjs.
                                                       
4. [Product] : Tanstack tables with server side searching, filter, pagination by Nuqs which is a Type-safe search params state manager in Nextjs.                                                                           
5. [Profile] : Multistep dynamic forms using react-hook-form and zod for form validation. 

6 [Not Found] : Not Found Page Added in the root level.      



## Getting Started

- `npm install`
- Create a `.env.local` file by copying the example environment file. You can type this command:
  `cp env.example.txt .env.local`
- Add the required environment variables to the `.env.local` file.
- Then type `npm run dev` to run the server. You should now be able to access the application at http://localhost:3000.
