import mongoose from 'mongoose';
import dotenv from 'dotenv';
import colors from 'colors';
import Pet from '../models/Pet.js';
import User from '../models/User.js';

// Load env vars
dotenv.config();

// Connect to DB - use MongoDB Atlas URI from environment variables or fallback
const dbUri = process.env.MONGODB_URI ;
console.log('Attempting to connect to MongoDB at:', dbUri);
mongoose.connect(dbUri);

// Sample pet data
const pets = [
  {
    name: 'Max',
    type: 'dog',
    breed: 'Golden Retriever',
    age: { value: 3, unit: 'years' },
    gender: 'male',
    size: 'large',
    color: 'golden',
    health: {
      vaccinated: true,
      neutered: true,
      medicalConditions: [],
      specialNeeds: false
    },
    behavior: {
      temperament: 'friendly',
      goodWith: {
        children: true,
        dogs: true,
        cats: true
      },
      trained: true
    },
    description: 'Max is a happy, energetic Golden Retriever who loves to play fetch and go for long walks. He is great with children and other pets, making him the perfect family companion.',
    location: {
      coordinates: [-73.9654, 40.7829],
      address: {
        street: '123 Central Park West',
        city: 'New York',
        state: 'NY',
        zipCode: '10023',
        country: 'USA'
      }
    },
    availability: {
      status: 'available',
      adoptionFee: 250
    }
  },
  {
    name: 'Bella',
    type: 'cat',
    breed: 'Siamese',
    age: { value: 2, unit: 'years' },
    gender: 'female',
    size: 'medium',
    color: 'cream with brown points',
    health: {
      vaccinated: true,
      neutered: true,
      medicalConditions: [],
      specialNeeds: false
    },
    behavior: {
      temperament: 'playful',
      goodWith: {
        children: true,
        dogs: false,
        cats: true
      },
      trained: true
    },
    description: 'Bella is a beautiful Siamese cat with striking blue eyes. She loves to play with toy mice and curl up in warm spots. She prefers to be the only pet in the household.',
    location: {
      coordinates: [-118.2437, 34.0522],
      address: {
        street: '456 Hollywood Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90028',
        country: 'USA'
      }
    },
    availability: {
      status: 'available',
      adoptionFee: 150
    }
  },
  {
    name: 'Charlie',
    type: 'dog',
    breed: 'Beagle',
    age: { value: 4, unit: 'years' },
    gender: 'male',
    size: 'medium',
    color: 'tricolor',
    health: {
      vaccinated: true,
      neutered: true,
      medicalConditions: [],
      specialNeeds: false
    },
    behavior: {
      temperament: 'curious',
      goodWith: {
        children: true,
        dogs: true,
        cats: false
      },
      trained: false
    },
    description: 'Charlie is a curious and friendly Beagle who loves to follow his nose. He enjoys long walks and has a typical Beagle howl. He needs some training but is eager to please.',
    location: {
      coordinates: [-87.6298, 41.8781],
      address: {
        street: '789 Michigan Ave',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60611',
        country: 'USA'
      }
    },
    availability: {
      status: 'available',
      adoptionFee: 200
    }
  },
  {
    name: 'Luna',
    type: 'cat',
    breed: 'Maine Coon',
    age: { value: 5, unit: 'years' },
    gender: 'female',
    size: 'large',
    color: 'tabby',
    health: {
      vaccinated: true,
      neutered: true,
      medicalConditions: [],
      specialNeeds: false
    },
    behavior: {
      temperament: 'gentle',
      goodWith: {
        children: true,
        dogs: true,
        cats: true
      },
      trained: true
    },
    description: 'Luna is a majestic Maine Coon with a fluffy coat and gentle personality. Despite her large size, she is a gentle giant who loves lounging and being brushed.',
    location: {
      coordinates: [-71.0589, 42.3601],
      address: {
        street: '101 Beacon St',
        city: 'Boston',
        state: 'MA',
        zipCode: '02116',
        country: 'USA'
      }
    },
    availability: {
      status: 'available',
      adoptionFee: 175
    }
  },
  {
    name: 'Cooper',
    type: 'dog',
    breed: 'Australian Shepherd',
    age: { value: 2, unit: 'years' },
    gender: 'male',
    size: 'medium',
    color: 'blue merle',
    health: {
      vaccinated: true,
      neutered: false,
      medicalConditions: [],
      specialNeeds: false
    },
    behavior: {
      temperament: 'energetic',
      goodWith: {
        children: true,
        dogs: true,
        cats: true
      },
      trained: true
    },
    description: 'Cooper is a highly intelligent and energetic Australian Shepherd who excels at agility. He needs an active family who can provide him with mental and physical challenges.',
    location: {
      coordinates: [-122.3321, 47.6062],
      address: {
        street: '222 Pike Place',
        city: 'Seattle',
        state: 'WA',
        zipCode: '98101',
        country: 'USA'
      }
    },
    availability: {
      status: 'available',
      adoptionFee: 300
    }
  },
  {
    name: 'Lily',
    type: 'cat',
    breed: 'Ragdoll',
    age: { value: 3, unit: 'years' },
    gender: 'female',
    size: 'medium',
    color: 'seal point',
    health: {
      vaccinated: true,
      neutered: true,
      medicalConditions: [],
      specialNeeds: false
    },
    behavior: {
      temperament: 'calm',
      goodWith: {
        children: true,
        dogs: true,
        cats: true
      },
      trained: true
    },
    description: 'Lily is a beautiful Ragdoll who loves to be held. True to her breed, she goes limp when picked up. She enjoys a quiet home with lots of cuddles and gentle play.',
    location: {
      coordinates: [-122.4194, 37.7749],
      address: {
        street: '333 Market St',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA'
      }
    },
    availability: {
      status: 'available',
      adoptionFee: 200
    }
  },
  {
    name: 'Rocky',
    type: 'dog',
    breed: 'Boxer',
    age: { value: 5, unit: 'years' },
    gender: 'male',
    size: 'large',
    color: 'fawn',
    health: {
      vaccinated: true,
      neutered: true,
      medicalConditions: ['arthritis'],
      specialNeeds: true,
      specialNeedsDescription: 'Requires joint supplements for mild arthritis'
    },
    behavior: {
      temperament: 'loyal',
      goodWith: {
        children: true,
        dogs: true,
        cats: false
      },
      trained: true
    },
    description: "Rocky is a strong but gentle Boxer who loves to play. He has mild arthritis but it doesn't slow him down much. He's a loyal companion who forms strong bonds with his family.",
    location: {
      coordinates: [-77.0369, 38.9072],
      address: {
        street: '444 Constitution Ave',
        city: 'Washington',
        state: 'DC',
        zipCode: '20001',
        country: 'USA'
      }
    },
    availability: {
      status: 'available',
      adoptionFee: 200
    }
  },
  {
    name: 'Daisy',
    type: 'dog',
    breed: 'Dachshund',
    age: { value: 7, unit: 'years' },
    gender: 'female',
    size: 'small',
    color: 'red',
    health: {
      vaccinated: true,
      neutered: true,
      medicalConditions: [],
      specialNeeds: false
    },
    behavior: {
      temperament: 'affectionate',
      goodWith: {
        children: true,
        dogs: true,
        cats: true
      },
      trained: true
    },
    description: 'Daisy is a sweet Dachshund who loves to cuddle. She enjoys short walks and then lounging on the couch. She gets along well with other pets and is very gentle with children.',
    location: {
      coordinates: [-104.9903, 39.7392],
      address: {
        street: '555 16th Street Mall',
        city: 'Denver',
        state: 'CO',
        zipCode: '80202',
        country: 'USA'
      }
    },
    availability: {
      status: 'available',
      adoptionFee: 175
    }
  },
  {
    name: 'Oliver',
    type: 'cat',
    breed: 'British Shorthair',
    age: { value: 4, unit: 'years' },
    gender: 'male',
    size: 'medium',
    color: 'gray',
    health: {
      vaccinated: true,
      neutered: true,
      medicalConditions: [],
      specialNeeds: false
    },
    behavior: {
      temperament: 'independent',
      goodWith: {
        children: true,
        dogs: false,
        cats: true
      },
      trained: true
    },
    description: 'Oliver is a dignified British Shorthair with a plush coat and copper-colored eyes. He enjoys having his own space but will seek affection on his terms. He prefers a home without dogs.',
    location: {
      coordinates: [-84.3880, 33.7490],
      address: {
        street: '666 Peachtree St',
        city: 'Atlanta',
        state: 'GA',
        zipCode: '30308',
        country: 'USA'
      }
    },
    availability: {
      status: 'available',
      adoptionFee: 150
    }
  },
  {
    name: 'Milo',
    type: 'dog',
    breed: 'French Bulldog',
    age: { value: 1, unit: 'years' },
    gender: 'male',
    size: 'small',
    color: 'brindle',
    health: {
      vaccinated: true,
      neutered: false,
      medicalConditions: [],
      specialNeeds: false
    },
    behavior: {
      temperament: 'playful',
      goodWith: {
        children: true,
        dogs: true,
        cats: true
      },
      trained: false
    },
    description: "Milo is an adorable French Bulldog puppy full of energy and affection. He loves to play with toys and is learning basic commands. He's a bundle of joy looking for an active home.",
    location: {
      coordinates: [-90.0715, 29.9511],
      address: {
        street: '777 Bourbon St',
        city: 'New Orleans',
        state: 'LA',
        zipCode: '70116',
        country: 'USA'
      }
    },
    availability: {
      status: 'available',
      adoptionFee: 400
    }
  }
];

// Image URLs for pets
const petImages = [
  { // Max - Golden Retriever
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1000',
    publicId: 'furever/pets/golden_retriever_max'
  },
  { // Bella - Siamese
    url: 'https://images.unsplash.com/photo-1606214174585-fe31582dc6ee?q=80&w=1000',
    publicId: 'furever/pets/siamese_bella'
  },
  { // Charlie - Beagle
    url: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?q=80&w=1000',
    publicId: 'furever/pets/beagle_charlie'
  },
  { // Luna - Maine Coon
    url: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=1000',
    publicId: 'furever/pets/maine_coon_luna'
  },
  { // Cooper - Australian Shepherd
    url: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?q=80&w=1000',
    publicId: 'furever/pets/aussie_cooper'
  },
  { // Lily - Ragdoll
    url: 'https://images.unsplash.com/photo-1617173944883-6ffbd60c5a8c?q=80&w=1000',
    publicId: 'furever/pets/ragdoll_lily'
  },
  { // Rocky - Boxer
    url: 'https://images.unsplash.com/photo-1543071220-6ee5bf71a54e?q=80&w=1000',
    publicId: 'furever/pets/boxer_rocky'
  },
  { // Daisy - Dachshund
    url: 'https://images.unsplash.com/photo-1514309354637-157e9be2a7c9?q=80&w=1000',
    publicId: 'furever/pets/dachshund_daisy'
  },
  { // Oliver - British Shorthair
    url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?q=80&w=1000',
    publicId: 'furever/pets/british_shorthair_oliver'
  },
  { // Milo - French Bulldog
    url: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=1000',
    publicId: 'furever/pets/frenchie_milo'
  }
];

// Import pet data
const importPets = async () => {
  try {
    // First, find a shelter account to associate with the pets
    const shelter = await User.findOne({ role: 'shelter' });

    if (!shelter) {
      console.log('No shelter account found. Creating a default shelter account...'.yellow);
      
      // Create a default shelter account if none exists
      const defaultShelter = await User.create({
        name: 'Happy Paws Shelter',
        email: 'shelter@example.com',
        password: 'password123',
        role: 'shelter',
        phone: '123-456-7890',
        address: {
          street: '123 Shelter Lane',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'USA'
        },
        isVerified: true
      });
      
      console.log(`Created default shelter: ${defaultShelter.name}`.green);
      
      // Add the shelter ID to each pet
      for (let i = 0; i < pets.length; i++) {
        pets[i].shelter = defaultShelter._id;
        pets[i].photos = [
          {
            url: petImages[i].url,
            publicId: petImages[i].publicId,
            isMain: true
          }
        ];
      }
    } else {
      console.log(`Using existing shelter: ${shelter.name}`.green);
      
      // Add the shelter ID to each pet
      for (let i = 0; i < pets.length; i++) {
        pets[i].shelter = shelter._id;
        pets[i].photos = [
          {
            url: petImages[i].url,
            publicId: petImages[i].publicId,
            isMain: true
          }
        ];
      }
    }

    // Clear existing pets
    await Pet.deleteMany();
    console.log('Pets cleared from database'.red);

    // Insert new pets
    const createdPets = await Pet.insertMany(pets);
    console.log(`${createdPets.length} pets imported`.green.inverse);

    // Exit process
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

// Delete all pets
const destroyPets = async () => {
  try {
    await Pet.deleteMany();
    console.log('All pets deleted from database'.red.inverse);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`.red);
    process.exit(1);
  }
};

// Determine which function to run based on command line argument
if (process.argv[2] === '-d') {
  destroyPets();
} else {
  importPets();
} 