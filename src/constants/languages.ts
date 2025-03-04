import axios from 'axios';

interface Runtime {
  language: string;
  version: string;
  aliases: string[];
}

export const LANGUAGE_VERSIONS: { [key: string]: string } = {
  "javascript": "18.15.0",
  "python": "3.10.4",
  "java": "17.0.1",
  "csharp": "10.0",
  "cpp": "10.2.0",
  "typescript": "4.7.4",
  "c":"10.2.0"
};

export const code_snippets: { [key: string]: string } = {
  "javascript": "console.log('Hello, JavaScript!');",
  "python": "print('Hello, Python!')",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Java!\");\n    }\n}",
  "csharp": "using System;\n\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine(\"Hello, C#!\");\n    }\n}",
  "cpp": "#include <iostream>\n\nint main() {\n    std::cout << \"Hello, C++!\";\n    return 0;\n}",
  "c": "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, C!\");\n    return 0;\n}",
  "typescript": "console.log('Hello, TypeScript!');"
};

export async function updateLanguageVersions() {
  const endpoint = "https://emkc.org/api/v2/piston/runtimes";
  try {
    const response = await axios.get<Runtime[]>(endpoint);
    const runtimes = response.data;

    runtimes.forEach(runtime => {
      const { language, version } = runtime;
      if (LANGUAGE_VERSIONS.hasOwnProperty(language)) {
        LANGUAGE_VERSIONS[language] = version;
      }
    });
  } catch (error) {
    console.error("Error fetching runtimes:", error);
  }
}

updateLanguageVersions();
