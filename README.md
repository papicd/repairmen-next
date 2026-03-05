# RepairMan App

A service provider marketplace built with Next.js, MongoDB, and Tailwind CSS.

## Features

- User registration with approval workflow
- Service provider listings
- Admin panel for managing users, places, and service types
- Multi-language support (English and Serbian)
- Responsive design

## User Approval Workflow

This app implements a user approval system to ensure quality control:

1. **User Registration**: New users register through the registration form
2. **Pending Status**: All new users (except admins) are created with `isApproved: false`
3. **Login Restriction**: Users cannot log in until their account is approved
4. **Admin Approval**: Administrators review and approve users from the Users page
5. **Active Status**: Once approved, users can log in and use the app

### Admin Functions

- **Approve Users**: Go to `/users` page, click "Approve" button next to pending users
- **Manage Places**: Add/edit locations in the admin panel
- **Manage Service Types**: Add service categories in the admin panel
- **View All Users**: See all registered users with their approval status

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_key
```

## Getting Started

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

### Creating Admin User

After setting up your database, create the initial admin user:

```bash
npm run create-admin
```

This will create an admin user with:
- **Email**: admin@example.com
- **Password**: admin123

**Important**: Change the admin password immediately after first login!

## Deployment

### Option 1: Vercel (Recommended)

Vercel is the easiest way to deploy Next.js apps.

1. **Push your code to GitHub**
2. **Go to [Vercel](https://vercel.com) and sign up**
3. **Click "Add New Project"**
4. **Import your GitHub repository**
5. **Add environment variables**:
   - `MONGODB_URI`: Your MongoDB connection string (use MongoDB Atlas for free tier)
   - `JWT_SECRET`: A secure random string (generate one using `openssl rand -base64 32`)
6. **Click Deploy**

### Option 2: Other Hosting Platforms

For other platforms (Railway, Render, DigitalOcean, etc.):

1. **Build the app**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

3. **Set environment variables** on your hosting platform

### Database (MongoDB)

For deployment, you need a MongoDB database. Options include:

1. **MongoDB Atlas** (Free tier available):
   - Create account at https://www.mongodb.com/atlas
   - Create a free cluster
   - Get connection string
   - Add your IP to whitelist

2. **Railway** - Offers free MongoDB plugin

3. **Render** - Offers free MongoDB instance

## Deploying with Database Reset

If you need to reset your database:

1. **Drop all collections** in your MongoDB
2. **Recreate admin user**:
   ```bash
   npm run create-admin
   ```
3. **Log in** as admin (admin@example.com / admin123)
4. **Add places and service types** in the admin panel
5. **Approve any pending users** from the Users page

## Migration Scripts

After deploying updates, run these scripts:

```bash
# Approve all existing users (run once after adding isApproved field)
npm run migrate-approval

# Create initial admin user after database reset
npm run create-admin
```

## Project Structure

```
repairman-app/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── admin/             # Admin panel pages
│   ├── users/             # User management page
│   └── ...
├── models/                 # MongoDB models
├── interfaces/             # TypeScript interfaces
├── lib/                    # Utility functions
├── scripts/                # Database scripts
└── dictionaries/           # Language files
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Vercel Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
