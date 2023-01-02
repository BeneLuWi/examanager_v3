import logging
from typing import List, Dict

from server.api.api_v1.routers.data_api.models import Rating
from server.config import ExamManagerSettings

settings = ExamManagerSettings()

logging.basicConfig(level=settings.LOGGING_LEVEL)
logger = logging.getLogger(settings.APP_NAME)


class RatingsFactory:
    """
    Compare: https://de.wikipedia.org/wiki/Vorlage:Punktesystem_der_gymnasialen_Oberstufe
    and https://notenkurve.de/punkte-in-noten-rechner/ for decimal rating
    """

    mss_to_text_rating: Dict[int, str] = {
        0: "Ungenügend",
        1: "Mangelhaft",
        2: "Mangelhaft",
        3: "Mangelhaft",
        4: "Ausreichend",
        5: "Ausreichend",
        6: "Ausreichend",
        7: "Befriedigend",
        8: "Befriedigend",
        9: "Befriedigend",
        10: "Gut",
        11: "Gut",
        12: "Gut",
        13: "Sehr Gut",
        14: "Sehr Gut",
        15: "Sehr Gut",
    }

    mss_to_school_rating: Dict[int, str] = {
        0: "6",
        1: "5-",
        2: "5",
        3: "5+",
        4: "4-",
        5: "4",
        6: "4+",
        7: "3-",
        8: "3",
        9: "3+",
        10: "2-",
        11: "2",
        12: "2+",
        13: "1-",
        14: "1",
        15: "1+",
    }

    mss_to_decimal_rating: Dict[int, float] = {
        # This could either start at 6.0 and end with 1.0 or start at 6.7 and end with 0.7
        0: 6.0,
        1: 5.3,
        2: 5.0,
        3: 4.7,
        4: 4.3,
        5: 4.0,
        6: 3.7,
        7: 3.3,
        8: 3.0,
        9: 2.7,
        10: 2.3,
        11: 2.0,
        12: 1.7,
        13: 1.3,
        14: 1.0,
        15: 0.7,
    }

    default_mss_points_by_percentage: dict[int, float] = {
        0: 0,
        1: 0.20,
        2: 0.27,
        3: 0.33,
        4: 0.39,
        5: 0.455,
        6: 0.50,
        7: 0.55,
        8: 0.60,
        9: 0.65,
        10: 0.70,
        11: 0.75,
        12: 0.80,
        13: 0.85,
        14: 0.90,
        15: 0.95,
    }

    def create_ratings(self, mms_points_by_percentage: Dict[int, float]) -> List[Rating]:
        ratings: List[Rating] = [
            Rating(
                percentage=mms_points_by_percentage[mss],
                mss_points=mss,
                school_rating=self.mss_to_school_rating[mss],
                text_rating=self.mss_to_text_rating[mss],
                decimal_rating=self.mss_to_decimal_rating[mss],
            )
            for mss in range(16)
        ]

        return ratings

    def create_default_ratings(self) -> List[Rating]:
        return self.create_ratings(mms_points_by_percentage=self.default_mss_points_by_percentage)
