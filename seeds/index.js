const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/yelp-camp");
  console.log("DATABASE CONNECTED!!");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const rand = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 300) + 100;
    const camp = new Campground({
      author: "643bfc6e39c9a5552c1dbf34",
      location: `${cities[rand].city},${cities[rand].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore iusto obcaecati ad voluptatibus corporis. Minus dolore laudantium dicta iste. Nobis itaque quae eveniet magni atque, ipsam quas ipsa optio maxime!",
      price: price,
      geometry: { 
            type: "Point", 
            coordinates: [
                cities[rand].longitude,
                cities[rand].latitude
            ] 
        },
      images: [
        {
          url: "https://res.cloudinary.com/diwltkauh/image/upload/v1682099794/YelpCamp/asm9mkgzj9e2ama2zu5h.jpg",
          filename: "YelpCamp/asm9mkgzj9e2ama2zu5h",
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
