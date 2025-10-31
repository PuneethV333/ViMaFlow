import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import RecomendationCard from "./RecomendationCard";

const AiRecomendation = () => {
  const { recomendation } = useContext(AuthContext);

  
  const list =
    Array.isArray(recomendation)
      ? recomendation
      : recomendation?.recommendations || [];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
        🔮 AI User Recommendations
      </h2>

      {list.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          grabCursor
          className="pb-10"
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {list.map((user, i) => (
            <SwiperSlide key={i}>
              <RecomendationCard info={user} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-gray-500 text-center text-lg">
            No AI recommendations yet 😅
          </p>
          <p className="text-sm text-gray-400 mt-1">
            (They’ll appear once the model suggests new users.)
          </p>
        </div>
      )}
    </div>
  );
};

export default AiRecomendation;
