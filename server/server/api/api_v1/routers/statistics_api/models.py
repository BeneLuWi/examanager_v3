from typing import List, Optional
from pydantic import BaseModel


class StatisticsElement(BaseModel):
    name: str  # name of task
    value_total: float  #
    value_w: Optional[float]  #
    value_m: Optional[float]  #
    value_d: Optional[float]  #


class TaskResult(BaseModel):
    name: str  # name of statistic in german
    statistics: List[StatisticsElement]


class StatisticsResult(BaseModel):
    mean: TaskResult
    median: TaskResult
    standard_deviation: TaskResult  # values per Task
    difficulty: TaskResult
    correlation: TaskResult
    self_assessment: TaskResult
