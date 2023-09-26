const mongoose = require("mongoose");
const User = require("../../models/userModel");
const { connectDB } = require("../../config/dbConfig");
const Employer = require("../../models/employerModel");
const Responses = require("../apiResponses");
// const SubscriptionPlan = require("../../models/subsciptionModel");
// const stripe = require('stripe')('sk_test_51NuYXQIRaI2xdKVa2qsVKF26DTZ97AFsfA5mnjCCpX6GBRqRGB5MpbOJtizI0NfrBHhzysuQW7bKNTufR8MoaYGO00i3a4BO0p');

module.exports.createEmployer = async (event) => {
  console.log("Lambda function invoked");
  await connectDB();

  try {
    const data = JSON.parse(event.body);
    console.log("Received data", data);

    const { companyName, email, industry, address } = data;

    if (!companyName || !email || !industry || !address) {
      console.log("All fields are required");
      return Responses._400({
        status: "error",
        message: "All fields are required",
      });
    }

    const nameRegex = /^[A-Za-z\s]+$/;
    if (!nameRegex.test(companyName)) {
      console.log("Invalid name format");
      return Responses._400({
        status: "error",
        message:
          "Invalid company name format! Company name should only contain letters and symbols",
      });
    }

    const industryEnum = [
      "IT",
      "Healthcare",
      "Finance",
      "Education",
      "Manufacturing",
    ];
    const industryNameRegex = /^[A-Za-z\s]+$/;

    if (!industryNameRegex.test(industry) || !industryEnum.includes(industry)) {
      console.log("Invalid industry");
      return Responses._400({
        status: "error",
        message:
          "Invalid industry field! Industry should be only from IT, Healthacare, Finance, Education and Manufacturing.",
      });
    }

    const addressRegex = /^[A-Za-z0-9\s,.'-]+$/;

    if (!addressRegex.test(address)) {
      console.log("Invalid address format");
      return Responses._400({
        status: "error",
        message:
          "Invalid address format. Address can only contain letters, numbers, spaces, and the following special characters: , . ' -",
      });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format");
      return Responses._400({
        status: "error",
        message:
          "Invalid email format! Please provide a correct email format (ex. johndoe@gmail.com)",
      });
    }

    const existingEmployer = await Employer.findOne({ email: email });
    if (existingEmployer) {
      console.log("Email already exists in the database");
      return Responses._400({
        status: "error",
        message: "Email already exists! Try another one.",
      });
    }

    // const validSubscriptionPlan = await SubscriptionPlan.findOne({
    //   _id: subscriptionPlan,
    // });
    // if (!validSubscriptionPlan) {
    //   console.log("Invalid subscription plan");
    //   return Responses._400({
    //     status: "error",
    //     message: "Invalid subscription plan! Please choose a valid one.",
    //   });
    // }

    // const customer = await stripe.customers.create({
    //   email: email,
    // });

    const newEmployer = new Employer({
      companyName,
      email,
      industry,
      address,
      stripeCustomerId: customer.id,
    });

    await newEmployer.save();
    console.log("Employer saved to the database", newEmployer);

    return Responses._200({
      status: "success",
      message: "Employer created successfully",
      newEmployer,
    });
  } catch (error) {
    console.log("An error happened", error);
    return Responses._500({
      status: "error",
      message:
        "An error occurred while retreiving the employer, check the logs for more information",
    });
  }
};
