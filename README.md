# Chrono: Minimalist Scheduling App

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/creativesoftwaregun/scheduling-using-javascript)

Chrono is a visually stunning, minimalist web application for scheduling events and managing calendars. Built on Cloudflare's edge network, it offers a lightning-fast, intuitive, and beautiful user experience. The core of the application is a flexible calendar that supports month, week, and day views. Users can effortlessly create, edit, and delete events through a clean, modal-based interface. Events can be color-coded and assigned to different calendars (e.g., Work, Personal). The design prioritizes clarity, generous white space, and subtle, delightful micro-interactions, making schedule management a serene and efficient task.

## ✨ Key Features

-   **Multiple Calendar Views**: Seamlessly switch between Month, Week, and Day views to manage your schedule effectively.
-   **Intuitive Event Management**: Create, update, and delete events with a clean and focused dialog interface.
-   **Calendar Categories**: Organize events by assigning them to different calendars like "Work" or "Personal", each with a distinct color.
-   **Responsive & Minimalist Design**: A beautiful, clutter-free interface that looks and works perfectly on any device, from desktops to mobile phones.
-   **High-Performance**: Built on Cloudflare Workers and Durable Objects, ensuring a fast and reliable experience globally.
-   **Modern UI/UX**: Features smooth animations, subtle hover states, and a polished user experience that makes scheduling a pleasure.

## 🚀 Technology Stack

-   **Frontend**: React, TypeScript, Vite
-   **Backend**: Hono on Cloudflare Workers
-   **State Management**: Zustand
-   **Styling**: Tailwind CSS, shadcn/ui
-   **UI/UX**: Framer Motion, Lucide React
-   **Date Handling**: `date-fns`
-   **Persistence**: Cloudflare Durable Objects

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/) package manager
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) logged into your Cloudflare account.

```bash
bun install -g wrangler
wrangler login
```

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/chrono-scheduler.git
    cd chrono-scheduler
    ```

2.  **Install dependencies:**
    This project uses `bun` for package management.
    ```bash
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite development server for the frontend and the Wrangler dev server for the backend worker, all connected and ready for development.
    ```bash
    bun run dev
    ```

The application will be available at `http://localhost:3000`.

## 📂 Project Structure

The project is organized into three main directories:

-   `src/`: Contains the frontend React application code, including pages, components, hooks, and styles.
-   `worker/`: Contains the Hono backend application that runs on Cloudflare Workers, including API routes and Durable Object entity definitions.
-   `shared/`: Contains TypeScript types and interfaces that are shared between the frontend and the backend to ensure type safety.

## 🛠️ Development

-   The frontend is a standard Vite + React application. You can modify components in `src/components` and pages in `src/pages`.
-   The backend API routes are defined in `worker/user-routes.ts`. You can add or modify Hono routes here.
-   Data models for Durable Objects are defined in `worker/entities.ts`.
-   Shared types are located in `shared/types.ts`. Any changes here will be reflected in both the frontend and backend.

## ☁️ Deployment

Deploying the application to Cloudflare is a single command. This will build the frontend assets and deploy the worker to your Cloudflare account.

1.  **Build and Deploy:**
    ```bash
    bun run deploy
    ```

2.  **Deploy with one click:**

    [![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/creativesoftwaregun/scheduling-using-javascript)

After deployment, Wrangler will provide you with the URL to your live application.

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements or find a bug, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.