/* eslint-disable @next/next/no-img-element */

const feroData: {
  level: number;
  points: number;
  rank: string;
} = {
  level: 3,
  points: 1450,
  rank: "Rising Host",
};

const FeroPointsCard = () => {
  return (
    <section className="w-full   transition-colors duration-300">
      <div className="p-6 md:p-14 lg:p-14">
        <section className="w-full text-gray-900 dark:text-white rounded-lg">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-6 sm:mb-8">
            Your Fero Journey
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 flex items-center gap-4  transition-colors duration-300">
              <div className="bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-full flex justify-center items-center shrink-0">
                <img
                  src="/images/levelpoint.png"
                  className="w-4 object-contain"
                  alt="Level icon"
                />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Level
                </p>
                <p className="text-lg sm:text-xl font-semibold">
                  Level {feroData.level}
                </p>
              </div>
            </div>

            {/* Points */}
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 sm:p-6 flex items-center gap-4  transition-colors duration-300">
              <div className="bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-full flex justify-center items-center shrink-0">
                <img
                  src="/images/pointsfero.png"
                  className="w-4 object-contain"
                  alt="Points icon"
                />
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">
                  Fero Points
                </p>
                <p className="text-lg sm:text-xl font-semibold">
                  {feroData.points.toLocaleString()} Fero Points
                </p>
              </div>
            </div>

            {/* Rank */}
            <div className="bg-blue-600 text-white rounded-xl p-4 sm:p-6 flex items-center gap-4 transition-colors duration-300">
              <div className="bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-full flex justify-center items-center shrink-0">
                <img
                  src="/images/RankferoPoints.png"
                  className="w-4 object-contain"
                  alt="Rank icon"
                />
              </div>
              <div>
                <p className="text-white/80 text-sm mb-1">Rank</p>
                <p className="text-lg sm:text-xl font-semibold">
                  {feroData.rank}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default FeroPointsCard;
