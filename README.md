# Self-Driving Car Project with JavaScript (No Libraries)

Welcome to the Self-Driving Car Project, a JavaScript-based implementation of a self-driving car with no external libraries. In this project, you will find a self-driving car that navigates a simulated road, complete with AI-controlled cars, sensors, and neural networks. This README will provide an overview of the project, its structure, and how to use it.

## Project Overview

The Self-Driving Car Project is a web-based simulation of a self-driving car. The project uses HTML, CSS, and JavaScript to create a virtual environment in which a self-driving car is controlled by a neural network. The car navigates a road, avoiding collisions with other vehicles and the road's borders. The project demonstrates the following key components:

- **Car Simulation:** The project features a virtual car that can move forward, reverse, turn left, and turn right. The car's movement is controlled using a neural network, which learns to navigate the road without collisions.

- **Neural Network:** The project implements a neural network that acts as the brain of the self-driving car. The neural network takes sensor data as input and produces control commands for the car.

- **Sensor System:** Each car in the simulation is equipped with a sensor system that can detect obstacles and road borders. The sensor data is used to provide input to the neural network.

- **Road and Traffic:** The virtual road is represented with lanes and borders, and there are other DUMMY cars (traffic) on the road. The self-driving cars (ones with the brains and sensors) must avoid collisions with both the road borders and other vehicles.

## Project Structure

The project is organized into several JavaScript files that work together to create the self-driving car simulation:

- **`index.html`:** The main HTML file that serves as the entry point for the project. It loads the necessary JavaScript files and provides the canvas elements for rendering.

- **`style.css`:** The CSS file that defines the project's styling and layout.

- **`main.js`:** The main JavaScript file responsible for orchestrating the simulation. It creates the road, car objects, and handles the animation loop.

- **`car.js`:** Defines the `Car` class, which represents the self-driving car. It handles the car's movement, sensors, and collision detection.

- **`road.js`:** Contains the `Road` class that defines the road's properties and rendering.

- **`controls.js`: Implements the `Controls` class that manages user or AI-controlled car movements.

- **`sensor.js`: Defines the `Sensor` class responsible for handling sensor data and detecting obstacles.

- **`network.js`: Contains the `NeuralNetwork` and `Level` classes, which represent the neural network and its layers. This neural network controls the car.

- **`utils.js`: Provides utility functions, such as linear interpolation and collision detection.

- **`visualizer.js`: Handles the visualization of the neural network.

## Usage

To run the Self-Driving Car Project, follow these steps:

1. Open the `index.html` file in a web browser.

2. The simulation will start, and you'll see the self-driving car navigating the road. You can click on the "💾" button to save the best car's brain to local storage and click on the "🗑️" button to delete it.

3. The best car is determined based on how far it has traveled. It is represented with a solid black outline, while other cars have a semi-transparent appearance.

4. The car's neural network is displayed on the right canvas, illustrating its connections and weights.

5. The car's controls can be customized by changing the neural network's structure and weights.

## Customization

You can customize the project by modifying various parameters and components. Here are some ideas for customization:

- **Neural Network:** Experiment with the structure and size of the neural network to see how it affects the car's behavior.

- **Car Appearance:** Change the car's appearance by replacing the `car.png` image or modifying the colors in the code.

- **Simulation Settings:** Adjust parameters like the number of AI cars, car dimensions, road width, and sensor settings to change the complexity of the simulation.

- **Control Method:** Modify the control method for the car to make it user-controlled or implement different AI algorithms.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature-name`.
3. Make your changes and commit them: `git commit -m 'Description of your changes'`.
4. Push your changes to your fork: `git push origin feature-name`.
5. Create a pull request on the original repository.

## Disclaimer

This project is a simulation and should not be used for real-world applications. It is for educational and experimental purposes only.

Enjoy exploring the Self-Driving Car Project and have fun experimenting with the capabilities of neural networks and autonomous vehicles in a virtual environment!