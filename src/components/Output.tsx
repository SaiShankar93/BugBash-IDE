interface OutputProps {
  output: string[] | null;
  isError: boolean;
  lightMode: boolean;
}

const Output = ({ output, isError, lightMode }: OutputProps) => {
  return (
    <div className="h-full p-4">
      <h2 className={`mb-4 text-lg ${lightMode ? 'text-black' : 'text-white'}`}>Output</h2>
      <div className={`h-[75vh] p-4 border rounded-lg overflow-y-auto ${isError ? "border-red-500" : "border-gray-700"}`}>
        {output ? (
          output.map((line, i) => (
            <p key={i} className={`text-sm ${isError ? "text-red-400" : (lightMode ? 'text-black' : "text-white")}`}>
              {line}
            </p>
          ))
        ) : (
          <p className={lightMode ? 'text-black' : 'text-white'}>
            Click &quot;Run&quot; to see the output here
          </p>
        )}
      </div>
    </div>
  );
};

export default Output;
