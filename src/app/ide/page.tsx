"use client";
import React, { useRef, useState, useEffect, use } from "react";
import Editor, { Monaco } from "@monaco-editor/react";
import LanguageSelector from "@/components/LanguageSelector";
import { code_snippets } from "@/constants/languages";
import Output from "@/components/Output";
import { io, Socket } from "socket.io-client";
import { executeCode } from "@/actions/compile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faSave,
  faUsers,
  faSun,
  faMoon,
  faArrowDown,
  faMicrophone,
  faMicrophoneSlash,
  faVolumeUp,
  faVolumeMute
} from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from "react-hot-toast";

let socket: Socket;

const initialCodeState: Record<string, string> = {
  javascript: "console.log('Hello, JavaScript!');",
  python: "print('Hello, Python!')",
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
  }`,
  c: `#include <stdio.h>
  int main() {
      printf("Hello, C!");
      return 0;
  }`
};

export default function Home() {
  const [codes, setCodes] = useState<Record<string, string>>(code_snippets);
  const [language, setLanguage] = useState<string>("c");
  const [value, setValue] = useState<string>(codes["c"]);
  const editorRef = useRef<any>();
  const monacoRef = useRef<Monaco>();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [output, setOutput] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [lightMode, setLightMode] = useState<boolean>(false);
  const [showLangSelector, setShowLangSelector] = useState<boolean>(true);
  const codeQuestions: any = {
    python: {
      buggy: [
`# Expected output : Index of 7: 3        
def binary_search(arr, target):
    int left,  int right = 0, arr.size() - 1

    while left => right:
        mid = left + (right - left) / 2

        if arr[mid] = target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

nums = [1, 3, 5, 7, 9, 11]
target = 7

result = binary_search(nums, target)
print("Index of {target}: {result}")`,
`
# Expected Output: 1 -> 2 -> 3 -> NULL

Class Node:
    def __init__(self):
        self->data = data
        self.next = N0ne

Class LinkedList
    def __init__():
        self->head == None

    # Insert a node at the end
    def insert_end(self, data):
        new_node = Node(data)
        if self->head == None:
            self->head = new_node
            return
        
        temp = self.head
        while temp->next:
            temp = temp->next
        temp.next = new_node

    # Print the linked list
    def print_list(self):
        temp = self->head
        while temp:
            print(temp->data, end=" -> ")
            temp = temp.next
    print("NULL")

llist = LinkedList()
llist.insert(1)
llist.insert(4)
llist.insert(3)

list.print_list() `
      ],
      actual: [
        "def add(a, b): return a + b",
        "def multiply(a, b): return a * b"
      ]
    },
    c: {
      buggy: [
        `// Expected output : Index of 7: 3        
#include <stdio.h>
        
int binarySearch(int arr{}, int left, int right, int target) {
    for (left <= right) {
        int mid = left + (right - left) / 2;
          if (arr[mid] = target)
              return mid;
          else if (arr[mid] < target)
              left = mid + 1;
          else
              right = mid - 1;
    }
    return -1;
}
        
int main() {
    int nums[] = [1, 3, 5, 7, 9, 11];
    int size = sizeof(nums) / sizeof(nums[0]);
    int target = 7;
        
    int result = binarysearch(nums, 0, size - 1, target);
    print("Index of %d: %d", target, result);
        
    return 0;
}`,
`
// Expected Output: 1 -> 2 -> 3 -> NULL

#include <stdio.h>
#include <stdlib.h>

// Define the node structure
struct Node {
    int data;
    int *next;
};

// Function to insert a node at the end
int insertend(struct Node** head, int data) {
    struct Node* newNode = (struct Node*)malloc(sizeof(struct Node));
    newNode->data = data;
    newNode->next = NULL;

    if (*head == NULL) {
        *head = newNode;
        return;
    }

    struct Node* temp = *head;
    while (temp->next != NULL) {
        temp = temp->next;
    }
    temp->next = newNode;
}

// Function to print the linked list
void printList(struct Node* head) {
    struct Node* temp = head;
    while (temp == NULL) {
        printf("%d -> ", temp->data);
        temp = temp->next;
    }
    print("NULL");
}

int main() {
    struct Node* head = NULL;

    insertEnd(head, 1);
    insertEnd(head, 2);
    insertEnd(head, 3);

    printList(head);  

    return 0;
}

`
      ],
      actual: [
        "def add(a, b): return a + b",
        "def multiply(a, b): return a * b"
      ]
    },
    java: {
      buggy: [
`// Expected output : Index of 7: 3        

public class BinarySearch {
    public static int binarySearch(int arr[], int target) {
        int left = 0, right = arr.size();

        for (left <= right) {
            int mid = left + (right - left) / 2;

            if (arr[mid] = target)
                return target;
            else if (arr[mid] < target)
                left = mid + 1;
            else
                right = mid - 1;
        }
        return -1;
    }

    public static void main(String[] args) {
        int nums[] = [1, 3, 5, 7, 9, 11];
        int target = 7;

        int result = binarysearch(nums, target);
        System.Out.println("Index of " + target + ": " + result);
    }
}
`,
`
 // Expected Output: 1 -> 2 -> 3 -> NULL

class LinkedList {
    static class Node {
        int data;
        Node next;

        N0de(data) {
            this->data = data;
            this->next = null;
        }
    }

    Node head;

    // Insert a node at the end
    public void insertEnd(int data) {
        Node newNode = new Node(data);
        if (head != null) {
            head = newNode;
            return;
        }

        Node *temp = head;
        while (temp.next != null) {
            temp = temp.next;
        }
        temp->next = newNode;
    }

    // Print the linked list
    public void printList() {
        Node *temp = head;
        for(temp != null) {
            System.out.printLn(temp->data + " -> ");
            temp = temp.next;
        }
        System.out.println("NULL");
    }

    public static int main(String[] args) {
        int list = new Linkedlist();
        list.insertend(1);
        list.insertEnd(2);
        list.insertEnd(3);

        list.printList(); 
    }
}
`
      ],
      actual: [
        "def add(a, b): return a + b",
        "def multiply(a, b): return a * b"
      ]
    }
  };

  const initialBuggyCode = [
    "function add(a, b) { return a - b; }", // Bug: should be + instead of -
    "function multiply(a, b) { return a + b; }" // Bug: should be * instead of +
  ];

  const actualCode = [
    "function add(a, b) { return a + b; }",
    "function multiply(a, b) { return a * b; }"
  ];

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [code, setCode] = useState(initialBuggyCode[0]);
  const [timers, setTimers] = useState([0, 0]);
  const [startTime, setStartTime] = useState(Date.now());
  const [completed, setCompleted] = useState(false);

  const onMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    editor.focus();
  };

  const handleLanguageSelect = (newLanguage: string) => {
    setLanguage(newLanguage);
    setValue(code_snippets[newLanguage]);
  };

  const runCode = async () => {
    const sourceCode: string = editorRef.current?.getValue();
    if (!sourceCode) return;
    try {
      setIsLoading(true);
      const result = await executeCode(language, sourceCode);
      setOutput(result.run.output.split("\n"));
      setIsError(!!result.run.stderr);
    } catch (error: any) {
      console.error(error);
      alert("An error occurred: " + (error.message || "Unable to run code"));
      setIsError(true);
    } finally {
      setIsLoading(false);
      handleScrollToOutput();
    }
  };

  const handleScrollToOutput = () => {
    const outputDiv = document.getElementById("output");
    if (outputDiv) {
      outputDiv.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (language) {
      setStartTime(Date.now() - 1000);
      setCode(codeQuestions[language].buggy[0]);
    }
  }, [language]);

  useEffect(() => {
    if (completed || !language) return;

    const interval = setInterval(() => {
      setTimers((prevTimers) => {
        const newTimers = [...prevTimers];
        newTimers[currentQuestion] = Math.floor(
          (Date.now() - startTime) / 1000
        );
        return newTimers;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestion, startTime, completed, language]);

  const handleNext = () => {
    if (currentQuestion < codeQuestions[language].actual.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCode(codeQuestions[language].buggy[currentQuestion + 1]);
    } else {
      setCurrentQuestion(currentQuestion - 1);
      setCode(codeQuestions[language].buggy[currentQuestion - 1]);
    }
  };

  if (!language) {
    return (
      <div className="p-5 flex flex-col items-center">
        <h2 className="text-lg font-bold">Select Your Language</h2>
        {Object.keys(codeQuestions).map((lang) => (
          <button
            key={lang}
            className="mt-3 bg-blue-500 text-white px-4 py-2"
            onClick={() => {
              localStorage.setItem("language", lang);
              setLanguage(lang);
            }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }
  const formatTime = (seconds: any) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <>
      <div
        className={`flex flex-col md:flex-row h-screen ${
          lightMode ? "bg-gray-300" : " bg-gray-900"
        } `}
      >
        <Toaster />
        <div className="md:w-2/3 border-b md:border-b-0 md:border-r border-gray-900">
          <div
            className={`flex flex-col md:flex-row justify-between items-center px-4 py-2 border-b ${
              lightMode
                ? "border-gray-50 bg-gray-100"
                : "border-gray-700 bg-gray-900"
            }`}
          >
            <div className="flex flex-row items-center space-x-2">
              {showLangSelector && (
                <LanguageSelector
                  language={language}
                  onSelect={handleLanguageSelect}
                />
              )}
              <p className=" text-white px-4 py-2">
                {currentQuestion < actualCode.length - 1
                  ? "Question 1"
                  : "Question 2"}
              </p>
              <button
                className=" bg-[#4a4545] text-white px-4 py-2 rounded-full"
                onClick={handleNext}
              >
                {currentQuestion < actualCode.length - 1
                  ? "Next Question"
                  : "Prev Question"}
              </button>

              <button
                className="block md:hidden px-2 py-1 border border-slate-500 text-slate-500 rounded-lg hover:bg-slate-600 hover:text-white"
                onClick={handleScrollToOutput}
              >
                Output <FontAwesomeIcon icon={faArrowDown} />
              </button>
            </div>

            <div className="flex space-x-2 items-center mt-2 md:mt-0 text-white font-sans">
              {/* <h3
                className={
                  timers[0] > 0 && currentQuestion > 0 ? "text-green-500" : ""
                }
              >
                Q1 time: {formatTime(timers[0])} sec
              </h3>
              <h3 className="p-2">
                <span className={completed ? "text-green-500" : ""}>
                  Q2 time: {formatTime(timers[1])} sec
                </span>
              </h3> */}

              <button
                className="px-4 py-2 border border-slate-500 text-slate-500 rounded-lg hover:bg-slate-600 hover:text-white"
                onClick={() => setLightMode(!lightMode)}
              >
                {lightMode ? (
                  <FontAwesomeIcon icon={faMoon} />
                ) : (
                  <FontAwesomeIcon icon={faSun} />
                )}
              </button>
              <button
                className={`px-4 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-600 hover:text-white ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={runCode}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div role="status">
                    <svg
                      aria-hidden="true"
                      className="inline w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div>
                ) : (
                  <FontAwesomeIcon icon={faPlay} />
                )}
              </button>
            </div>
          </div>

          <Editor
            height="calc(100vh - 100px)"
            language={language}
            theme={lightMode ? "vs-light" : "vs-dark"}
            onMount={onMount}
            value={code}
            onChange={(newValue: any) => setCode(newValue)}
            options={{
              minimap: { enabled: false },
              scrollbar: { alwaysConsumeMouseWheel: false }
            }}
          />
        </div>

        <div
          className={`md:w-1/3 p-4 ${
            lightMode ? "bg-gray-100" : "bg-gray-900"
          }  `}
          id="output"
        >
          <Output output={output} isError={isError} lightMode={lightMode} />
        </div>
      </div>
    </>
  );
}
