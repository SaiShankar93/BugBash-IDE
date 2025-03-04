import axios from 'axios';

interface Runtime {
  language: string;
  version: string;
  aliases: string[];
}

export const LANGUAGE_VERSIONS: { [key: string]: string } = {
  "python": "3.10.4",
  "java": "17.0.1",
  "c":"10.2.0"
};

export const code_snippets: { [key: string]: string } = {
  "python": "print('Hello, Python!')",
  "java": "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, Java!\");\n    }\n}",
  "c": "#include <stdio.h>\n\nint main() {\n    printf(\"Hello, C!\");\n    return 0;\n}",
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
