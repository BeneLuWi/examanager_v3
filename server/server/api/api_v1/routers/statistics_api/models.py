from typing import List, Optional
from pydantic import BaseModel, Field


class StatisticsElement(BaseModel):
    name: str  # name of task
    value_total: float
    value_w: Optional[float] = Field(...)
    value_m: Optional[float] = Field(...)
    value_d: Optional[float] = Field(...)


class TaskResult(BaseModel):
    name: str  # name of statistic in german
    statistics: List[StatisticsElement]


class StatisticsResult(BaseModel):
    mean: TaskResult
    median: TaskResult
    mean_mss: TaskResult
    median_mss: TaskResult
    standard_deviation: TaskResult  # values per Task
    difficulty: TaskResult
    correlation: TaskResult
    self_assessment_mean: TaskResult
    self_assessment_median: TaskResult
    self_assessment_standard_deviation: TaskResult
