# Travel Agency Management System

<p align="center">
  <img src="https://laravel.com/img/logomark.min.svg" alt="Laravel" height="80">
  <img src="https://vitejs.dev/logo.svg" alt="Vite" height="80" style="margin: 0 20px;">
  <img src="https://tailwindcss.com/favicons/favicon.svg" alt="Tailwind CSS" height="80">
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Laravel-12.x-red" alt="Laravel Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/PHP-8.2+-777BB4" alt="PHP Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/MySQL-8.0+-4479A1" alt="MySQL Version"></a>
  <a href="#"><img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License"></a>
</p>

## About Travel Agency Management System

A comprehensive travel agency management system built with Laravel, Vite, and Tailwind CSS. This application provides a complete solution for managing travel agency operations including hotel bookings, ticket sales, transport bookings, and package management.

### Key Features

- **User Management**: Multi-role authentication system (Admin, Staff, Customer)
- **Hotel Booking**: Comprehensive hotel and room management
- **Ticket Sales**: Event and ticket management with QR codes
- **Transport Booking**: Transport provider and route management
- **Package Builder**: Custom travel package creation
- **Payment Processing**: Multiple payment gateway integration
- **Reporting**: Business intelligence and analytics

### Technology Stack

- **Backend**: Laravel 10.x
- **Frontend**: Vite, Blade, Tailwind CSS, Alpine.js
- **Database**: MySQL 8.0+
- **Authentication**: Laravel Breeze with Sanctum
- **Payment Processing**: Stripe/PayPal SDK
- **Search**: Laravel Scout with Meilisearch
- **Caching**: Redis

## Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ and NPM
- MySQL 8.0+ or PostgreSQL 13+
- Redis (for caching and queues)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/travel-agency.git
   cd travel-agency/laravel-app
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install JavaScript dependencies:
   ```bash
   npm install
   ```

4. Copy the environment file:
   ```bash
   cp .env.example .env
   ```

5. Generate application key:
   ```bash
   php artisan key:generate
   ```

6. Configure your database in the `.env` file

7. Run database migrations:
   ```bash
   php artisan migrate
   ```

8. Build assets:
   ```bash
   npm run dev
   ```

9. Start the development server:
   ```bash
   php artisan serve
   ```

10. Visit `http://localhost:8000` in your browser

### Development

- Run tests:
  ```bash
  php artisan test
  ```

- Watch for asset changes:
  ```bash
  npm run dev
  ```

- Production build:
  ```bash
  npm run build
  ```

## Project Structure

```
laravel-app/
├── app/                  # Application code
│   ├── Http/             # Controllers and middleware
│   ├── Models/           # Eloquent models
│   └── ...
├── config/              # Configuration files
├── database/             # Database migrations and seeders
├── public/               # Publicly accessible files
├── resources/
│   ├── js/              # JavaScript files
│   ├── css/              # CSS files
│   └── views/            # Blade templates
├── routes/               # Application routes
├── storage/              # Storage for logs, compiled views, etc.
├── tests/                # Test files
└── vendor/               # Composer dependencies
```

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Travel Agency Management System! Please read our [contribution guidelines](CONTRIBUTING.md) before submitting pull requests.

## Code of Conduct

In order to ensure that the open-source community is welcoming to all, please review and abide by the [Code of Conduct](CODE_OF_CONDUCT.md).

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
