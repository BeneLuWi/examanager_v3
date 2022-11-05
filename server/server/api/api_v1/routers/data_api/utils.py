import logging
from typing import List

from server.api.api_v1.routers.data_api.models import Rating
from server.config import ExamManagerSettings

settings = ExamManagerSettings()

logging.basicConfig(level=settings.LOGGING_LEVEL)
logger = logging.getLogger(settings.APP_NAME)


class DefaultRatingsFactory:
    def create_default_ratings(self) -> List[Rating]:
        ratings: List[Rating] = list()
        ratings.append(Rating(percentage=0.5, mss_points=1))
        ratings.append(Rating(percentage=0.5, mss_points=2))
        ratings.append(Rating(percentage=0.5, mss_points=3))
        ratings.append(Rating(percentage=0.5, mss_points=4))
        ratings.append(Rating(percentage=0.5, mss_points=5))
        ratings.append(Rating(percentage=0.5, mss_points=6))
        ratings.append(Rating(percentage=0.5, mss_points=7))
        ratings.append(Rating(percentage=0.5, mss_points=8))
        ratings.append(Rating(percentage=0.5, mss_points=9))
        ratings.append(Rating(percentage=0.5, mss_points=10))
        ratings.append(Rating(percentage=0.5, mss_points=11))
        ratings.append(Rating(percentage=0.5, mss_points=12))
        ratings.append(Rating(percentage=0.5, mss_points=13))
        ratings.append(Rating(percentage=0.5, mss_points=14))
        ratings.append(Rating(percentage=0.5, mss_points=15))

        return ratings
