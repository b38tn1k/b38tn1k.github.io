//https://chat.openai.com/chat#

// Define a Tech class to represent a technology in the tech tree
class Tech {
  constructor(name, description, dependencies) {
    this.name = name;
    this.description = description;
    this.dependencies = dependencies;
    this.unlocked = false;
  }

  // A method to check if this tech is unlockable (i.e. all its dependencies are satisfied)
  isUnlockable() {
    // Check if any of this tech's dependencies are not satisfied
    for (let i = 0; i < this.dependencies.length; i++) {
      if (!this.dependencies[i].unlocked) {
        return false;
      }
    }

    // If all dependencies are satisfied, this tech is unlockable
    return true;
  }

  // A method to unlock this tech, assuming all dependencies are satisfied
  unlock() {
    if (this.isUnlockable()) {
      this.unlocked = true;
      return true;
    } else {
      return false;
    }
  }
}

// Define a TechTree class to represent the entire tech tree
class TechTree {
  constructor() {
    this.techs = [];
  }

  // A method to add a new tech to the tech tree
  addTech(tech) {
    this.techs.push(tech);
  }

  // A method to unlock a tech, given its name
  unlockTech(name) {
    // Find the tech with the given name
    for (let i = 0; i < this.techs.length; i++) {
      if (this.techs[i].name === name) {
        // Attempt to unlock the tech
        return this.techs[i].unlock();
      }
    }

    // If the tech is not found, return false
    return false;
  }
}

// Example usage:

// Create a new tech tree
const techTree = new TechTree();

// Create some techs, with their dependencies
const agriculture = new Tech("Agriculture", "Enables farming.", []);
const bronzeWorking = new Tech("Bronze Working", "Enables the use of bronze tools and weapons.", [agriculture]);
const ironWorking = new Tech("Iron Working", "Enables the use of iron tools and weapons.", [agriculture]);

// Add the techs to the tech tree
techTree.addTech(agriculture);
techTree.addTech(bronzeWorking);
techTree.addTech(ironWorking);

// Unlock some techs
console.log(techTree.unlockTech("Agriculture")); // Output: true
console.log(techTree.unlockTech("Bronze Working")); // Output: true
console.log(techTree.unlockTech("Iron Working")); // Output: false (Agriculture is not yet unlocked)

// Unlock the remaining techs
techTree.unlockTech("Agriculture");
console.log(techTree.unlockTech("Iron Working")); // Output: true
