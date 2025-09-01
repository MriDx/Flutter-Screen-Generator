import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
    
    context.subscriptions.push(vscode.commands.registerCommand('flutter-screen-generator.createScreen', async () => {
      await createScreen();
    }));
  
  context.subscriptions.push(vscode.commands.registerCommand('flutter-screen-generator.createScreenWithBloc', async () => {
    await createScreenWithBloc();
   }));
  
}


async function createScreen()  {
  // Ask for screen name
  const screenName = await vscode.window.showInputBox({ prompt: 'Enter screen name (e.g., home)' });

        if (!screenName) { return; }

        // Ask for widget type
        const widgetType = await vscode.window.showQuickPick(['StatelessWidget', 'StatefulWidget'], {
            placeHolder: 'Select widget type'
        });
      if (!widgetType) { return; }
      
      const dirName = await vscode.window.showInputBox({ prompt: 'Enter directory name' });
        if (!dirName) { return; }

        // Get workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace open');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;
        const screenDir = path.join(folderPath, 'lib', 'src', 'screens', sanitizeDirName(dirName));
        fs.mkdirSync(screenDir, { recursive: true });

  // Generate Dart code
  
        const { snake, pascal } = normalizeName(screenName);

        const className = pascal + 'Screen';
        const content = widgetType === 'StatelessWidget'
            ? generateStatelessWidget(className)
            : generateStatefulWidget(className);

        // Create file
        const filePath = path.join(screenDir, `${screenName}_screen.dart`);
        fs.writeFileSync(filePath, content);

        vscode.window.showInformationMessage(`✅ ${className} created as ${widgetType}`);
}


function generateStatelessWidget(className: string): string {
    return `import 'package:flutter/material.dart';

class ${className} extends StatelessWidget {
  const ${className}({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${className}')),
      body: const Center(child: Text('${className}')),
    );
  }
}`;
}

function generateStatefulWidget(className: string): string {
    return `import 'package:flutter/material.dart';

class ${className} extends StatefulWidget {
  const ${className}({Key? key}) : super(key: key);

  @override
  State<${className}> createState() => _${className}State();
}

class _${className}State extends State<${className}> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${className}')),
      body: const Center(child: Text('${className}')),
    );
  }
}`;
}

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}



async function createScreenWithBloc() {

        // Ask for screen name
        const screenName = await vscode.window.showInputBox({ prompt: 'Enter screen name (e.g., Login)' });
        if (!screenName) { return; }

        // Ask for widget type
        const widgetType = await vscode.window.showQuickPick(['StatelessWidget', 'StatefulWidget'], {
            placeHolder: 'Select widget type'
        });
        if (!widgetType) { return; }
  

        // Ask for directory name
        const dirName = await vscode.window.showInputBox({ prompt: 'Enter directory name (e.g., auth/login)' });
        if (!dirName) { return; }

        // Get workspace folder
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            vscode.window.showErrorMessage('No workspace open');
            return;
        }

        const folderPath = workspaceFolders[0].uri.fsPath;
        const screenDir = path.join(folderPath, 'lib', 'src', 'screens', sanitizeDirName(dirName));
        fs.mkdirSync(screenDir, { recursive: true });
  
        const { snake, pascal } = normalizeName(screenName);
        
        const className = pascal + 'Screen';
        const blocClassName = pascal + 'Bloc';
        const eventClassName = pascal + 'Event';
        const stateClassName = pascal + 'State';
        

        const blocDirName = path.join(screenDir + '/bloc');
        const eventDirName = path.join(screenDir + '/event');
        const stateDirName = path.join(screenDir + '/state');
        

        fs.mkdirSync(blocDirName, { recursive: true });
        fs.mkdirSync(eventDirName, { recursive: true });
        fs.mkdirSync(stateDirName, { recursive: true });
  

        const blocFileName = `${snake}_bloc.dart`;

        
        const screenFile = path.join(screenDir, `${snake}_screen.dart`);
        const blocFile = path.join(blocDirName, `${snake}_bloc.dart`);
        const eventFile = path.join(eventDirName, `${snake}_event.dart`);
        const stateFile = path.join(stateDirName, `${snake}_state.dart`);

        // const className = toClassName(screenName) + 'Screen';
        // const blocName = toClassName(screenName) + 'Bloc';
        // const eventName = toClassName(screenName) + 'Event';
        // const stateName = toClassName(screenName) + 'State';

        // File paths
        // const screenFile = path.join(screenDir, `${screenName}.dart`);
        // const blocFile = path.join(screenDir, `${screenName}_bloc.dart`);
        // const eventFile = path.join(screenDir, `${screenName}_event.dart`);
        // const stateFile = path.join(screenDir, `${screenName}_state.dart`);

        // Generate content
        const screenContent = generateScreenWithBloc(className, blocClassName, blocFileName, widgetType);
        const blocContent = generateBloc(blocClassName, eventClassName, stateClassName);
        const eventContent = generateEvent(eventClassName);
        const stateContent = generateState(stateClassName);

        // Write files
        fs.writeFileSync(screenFile, screenContent);
        fs.writeFileSync(blocFile, blocContent);
        fs.writeFileSync(eventFile, eventContent);
        fs.writeFileSync(stateFile, stateContent);

        // Open main screen file
        const document = await vscode.workspace.openTextDocument(screenFile);
        vscode.window.showTextDocument(document);

        vscode.window.showInformationMessage(`✅ Screen with Bloc created in ${dirName}`);
}


function generateScreenWithBloc(className: string, blocName: string, blocFileName: string, widgetType: string): string {
    const widget = widgetType === 'StatelessWidget'
      ?
`class ${className} extends StatelessWidget {
  const ${className}({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${className}')),
      body: const Center(child: Text('${className}')),
    );
  }
}`
      :
`class ${className} extends StatefulWidget {
  const ${className}({Key? key}) : super(key: key);

  @override
  State<${className}> createState() => _${className}State();
}

class _${className}State extends State<${className}> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('${className}')),
      body: const Center(child: Text('${className}')),
    );
  }
}`;

    return `import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import './bloc/${blocFileName}';

${widget}`;
}

function generateBloc(blocName: string, eventName: string, stateName: string): string {
    return `import 'package:flutter_bloc/flutter_bloc.dart';
import '../event/${toSnakeCase(eventName)}.dart';
import '../state/${toSnakeCase(stateName)}.dart';

class ${blocName} extends Bloc<${eventName}, ${stateName}> {
  ${blocName}() : super(${stateName}Initial()) {
    on<${eventName}>((event, emit) {
      // TODO: Handle events
    });
  }
}`;
}

function generateEvent(eventName: string): string {
    return `abstract class ${eventName} {}

class ${eventName}Started extends ${eventName} {}`;
}

function generateState(stateName: string): string {
    return `abstract class ${stateName} {}

class ${stateName}Initial extends ${stateName} {}`;
}

// ✅ Helpers
function sanitizeDirName(dirName: string): string {
    return dirName.replace(/[^a-zA-Z0-9/_]/g, ''); // allow only letters, numbers, underscore, slash
}

function toClassName(name: string): string {
    return name
        .split('_')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
        .join('');
}

function toScreenName(name: string): string {
  return `${name}Screen`;
}


function toSnakeCase(name: string): string {
    return name.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}


function normalizeName(name: string) {
    // Replace non-alphanumeric characters with space, then collapse multiple spaces
    const cleaned = name.trim().replace(/[^a-zA-Z0-9]+/g, ' ').replace(/\s+/g, ' ').toLowerCase();

    const words = cleaned.split(' ');
    return {
        fileName: words.join('_'), // e.g., grievance_create
        snake: words.join('_'),    // same as file name
        pascal: words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('') // e.g., GrievanceCreate
    };
}


