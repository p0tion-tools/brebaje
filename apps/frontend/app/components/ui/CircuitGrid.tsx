interface CircuitGridProps {
  totalCircuits: number;
  completedCircuits: number;
}

export const CircuitGrid = ({
  totalCircuits,
  completedCircuits,
}: CircuitGridProps) => {
  return (
    <div className="w-full flex justify-center">
      {/* Simple counter box - smaller */}
      <div className="border-2 border-black rounded-xl px-8 py-5 text-center bg-white">
        <div className="text-4xl font-bold text-black mb-1">
          {completedCircuits}
        </div>
        <p className="text-sm text-black">
          of {totalCircuits} circuits completed
        </p>
      </div>
    </div>
  );
};
