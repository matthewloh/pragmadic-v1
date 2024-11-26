# Pragmadic - DE Rantau Digital Nomad Platform

## Overview

Pragmadic is a comprehensive web platform designed to support Malaysia's digital nomad ecosystem, with a particular focus on Penang. The platform serves as a bridge between Digital Economy (DE) Rantau pass holders, local businesses, and program administrators.

## Key Features

-   🌍 **Geographical Management**: Hierarchical organization of regions, states, and DE Rantau recognized hubs
-   🏢 **Hub Management**: Business profile creation and management for DE Rantau recognized establishments
-   📅 **Event System**: Creation and management of events by hub owners for digital nomads
-   ⭐ **Review System**: User reviews and ratings for registered hubs
-   👥 **Community Interaction**: Profile customization and networking features
-   📊 **Admin Dashboard**: Comprehensive management tools for DE Rantau administrators
-   🤖 **AI-Powered Support**: Retrieval-augmented generation for accurate information delivery

## Tech Stack

-   **Frontend**: Next.js 14 with React Server Components
-   **Backend**: Supabase
-   **Database ORM**: Drizzle
-   **Styling**: TailwindCSS
-   **UI Components**: Shadcn/ui
-   **Type Safety**: TypeScript
-   **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

-   Node.js 18.17 or later
-   Supabase account and project
-   Environment variables configured

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/pragmadic.git
cd pragmadic
```

2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
pragmadic/
├── src/
│   ├── app/             # Next.js app router
│   ├── components/      # Reusable components
│   ├── features/        # Feature-specific components
│   ├── lib/            # Utility functions and configurations
│   └── types/          # TypeScript type definitions
├── public/             # Static assets
└── tests/             # Test files
```

## User Roles

-   **DE Rantau Admins**: Platform administrators with full management capabilities
-   **Hub Owners**: Business owners of DE Rantau recognized establishments
-   **Digital Nomads**: DE Rantau pass holders and applicants

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

-   DE Rantau program administrators
-   Digital nomad community in Penang
-   Project supervisors and mentors

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/pragmadic](https://github.com/yourusername/pragmadic)
