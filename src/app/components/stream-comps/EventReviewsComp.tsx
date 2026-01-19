import { IReview } from "@/app/interfaces/event.interface";
import axiosApi from "@/lib/axios";
import React, { useEffect, useState } from "react";

const EventReviewsComp: React.FC<{ eventId: string }> = ({ eventId }) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const getReview = async () => {
      try {
        const { data } = await axiosApi(`/events/${eventId}/reviews`);

        if (data) {
          setReviews(data.data.eventReviews || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getReview();
  }, [eventId]);
  return (
    <div>
      <div className="bg-white shadow-md rounded-xl p-6 mt-6">
        <h2 className="text-lg font-bold mb-4 text-black">Event Reviews</h2>

        {isLoading ? (
          <p className="text-gray-500">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500 italic">No reviews yet for this event.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review._id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="flex mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      className={`text-xl ${
                        review?.rating || 0 >= star
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}>
                      ★
                    </span>
                  ))}
                </div>

                <p className="text-gray-800 mb-2">{review.comment}</p>

                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    {/* {review.userId?.firstName} {review.userId?.lastName} */}
                  </span>
                  <span>
                    {new Date(review?.createdAt || "").toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventReviewsComp;
