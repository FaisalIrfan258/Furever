# FurEver Home - Pet Adoption Platform Backend

A complete backend API for a pet adoption platform built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Role-based access control (User, Admin, Shelter)
- Pet listings with filtering, pagination, and search
- Adoption application system
- Rescue reports for stray/injured animals
- Lost and found pet reporting system
- Donations and sponsorships
- Image uploads with Cloudinary

## API Endpoints

| Endpoint             | Method | Description                          | Auth    |
| -------------------- | ------ | ------------------------------------ | ------- |
| `/api/auth/register` | POST   | Register a new user                  | ❌       |
| `/api/auth/login`    | POST   | Login and get token                  | ❌       |
| `/api/auth/me`       | GET    | Get user profile                     | ✅ User  |
| `/api/auth/me`       | PUT    | Update user profile                  | ✅ User  |
| `/api/pets`          | GET    | Get all pets                         | ❌       |
| `/api/pets/:id`      | GET    | Get pet details                      | ❌       |
| `/api/pets`          | POST   | Add pet                              | ✅ Admin/Shelter |
| `/api/pets/:id`      | PUT    | Edit pet                             | ✅ Admin/Shelter |
| `/api/pets/:id`      | DELETE | Delete pet                           | ✅ Admin/Shelter |
| `/api/adoption`      | GET    | View all applications                | ✅ Admin/Shelter |
| `/api/adoption/:id`  | GET    | View application details             | ✅ User/Admin/Shelter |
| `/api/adoption`      | POST   | Submit application                   | ✅ User  |
| `/api/adoption/:id`  | PUT    | Update application status            | ✅ Admin/Shelter |
| `/api/rescue`        | GET    | View all rescue reports              | ✅ Admin/Shelter |
| `/api/rescue/:id`    | GET    | View rescue report details           | ✅ User  |
| `/api/rescue`        | POST   | Report rescue                        | ✅ User  |
| `/api/rescue/:id`    | PUT    | Update rescue report                 | ✅ Admin/Shelter |
| `/api/rescue/:id`    | DELETE | Delete rescue report                 | ✅ Admin |
| `/api/lost-found`    | GET    | View all lost/found reports          | ❌       |
| `/api/lost-found/:id`| GET    | View lost/found report details       | ❌       |
| `/api/lost-found`    | POST   | Submit lost/found report             | ✅ User  |
| `/api/lost-found/:id`| PUT    | Update lost/found report             | ✅ User  |
| `/api/lost-found/:id`| DELETE | Delete lost/found report             | ✅ User  |
| `/api/donate`        | GET    | View all donations                   | ✅ Admin |
| `/api/donate/:id`    | GET    | View donation details                | ✅ User/Admin/Shelter |
| `/api/donate`        | POST   | Make a donation                      | ✅ User  |

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/furever-home-backend.git
cd furever-home-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables (see `.env.example`):
```
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Create an `uploads` directory in the root folder
```bash
mkdir uploads
```

## Running the Application

### Development mode
```bash
npm run dev
```

### Production mode
```bash
npm start
```

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary for image storage
- Express Validator for input validation
- Multer for file uploads

## Project Structure

```
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Mongoose models
│   ├── routes/         # API routes
│   ├── utils/          # Utility functions
│   └── server.js       # Entry point
├── uploads/            # Temporary storage for uploads
├── .env                # Environment variables
├── .env.example        # Example environment variables
└── package.json        # Project dependencies
```

## License

ISC
