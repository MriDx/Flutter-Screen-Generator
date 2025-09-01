# Flutter Screen Generator
A VS Code extension to quickly generate Flutter screens, with or without Bloc, following best practices.


## Features
- Generate a Flutter **Screen** (Stateless or Stateful).
- Optionally generate **Bloc files** (Bloc, Event, State) for the screen.
- Supports **nested directory structure** (e.g., `auth/login`).
- Auto-converts **screen names** to correct naming conventions:
  - `login` → `login_screen.dart` → `LoginScreen`
- Sanitizes user input to prevent invalid file names.


## Commands
- `Flutter Screen Generator: Create Screen`  
  Creates a Flutter screen (Stateless or Stateful widget).

- `Flutter Screen Generator: Create Screen with Bloc`  
  Creates a Flutter screen along with Bloc, Event, and State files.

You can run these commands from:
- Command Palette (`Ctrl + Shift + P` → search for "Flutter Screen Generator")
- Context menu on project folder in Explorer


## How to Use
1. Open your Flutter project in VS Code.
2. Press `Ctrl + Shift + P` and type `Flutter Screen Generator`.
3. Choose:
    - **Create Screen** → for simple screen
    - **Create Screen with Bloc** → for screen + Bloc files
4. Enter:
    - **Directory name** (e.g., `auth/login`)
    - **Screen name** (e.g., `login` or `Login`)
5. Choose **StatelessWidget** or **StatefulWidget** (for Create Screen command).
6. Done! Files will be created in:
    ```
    lib/auth/login
      /bloc/login_bloc.dart
      /event/login_event.dart
      /state/login_state.dart
	  login_screen.dart
    ```


## Requirements
- VS Code installed
- Flutter SDK installed and configured


## Release Notes
### 1.0.0
- Initial release: Generate Flutter screens with or without Bloc.


