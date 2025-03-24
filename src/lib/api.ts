
import { getDefaultDateRange } from './utils'

const API_BASE_URL = 'https://api.logistics-metrics.example'

// Error class for API errors
export class ApiError extends Error {
  status: number
  
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// Default headers for API calls
const defaultHeaders = {
  'Content-Type': 'application/json',
}

// API fetcher with error handling
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
    })

    if (!response.ok) {
      let errorMessage = 'Something went wrong'
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || errorMessage
      } catch (error) {
        // Ignore JSON parsing error
      }
      throw new ApiError(errorMessage, response.status)
    }

    return response.json() as Promise<T>
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError('Network error', 0)
  }
}

// Types
export type ActivityCode = string
export type DateRange = {
  startDate: string
  endDate: string
}

// API interfaces for response types
export interface PreparationTimeData {
  averageTimeMinutes: number
  dailyData: Array<{
    date: string
    timeMinutes: number
  }>
  previousPeriodAverage?: number
  trend?: 'up' | 'down' | 'stable'
}

export interface PiecesPerWorkerData {
  average: number
  byTeam: Array<{
    teamId: string
    teamName: string
    piecesPerWorker: number
  }>
}

export interface OnTimePreparationData {
  rate: number
  trend: 'up' | 'down' | 'stable'
  historical: Array<{
    date: string
    rate: number
  }>
}

export interface RevenueComparisonData {
  currentPeriod: {
    startDate: string
    endDate: string
    revenue: number
  }
  previousPeriod: {
    startDate: string
    endDate: string
    revenue: number
  }
  percentageChange: number
  dailyData: Array<{
    date: string
    currentRevenue: number
    previousRevenue: number
  }>
}

export interface ShippingCostData {
  totalCost: number
  byCarrier: Array<{
    carrier: string
    cost: number
    percentage: number
  }>
  byDestination: Array<{
    destination: string
    cost: number
    percentage: number
  }>
}

export interface LogisticsCostEvolutionData {
  totalCosts: Array<{
    date: string
    cost: number
  }>
  byCategory: Array<{
    category: string
    costs: Array<{
      date: string
      cost: number
    }>
  }>
}

export interface LogisticsCostRatioData {
  ratio: number
  trend: 'up' | 'down' | 'stable'
  historical: Array<{
    date: string
    ratio: number
  }>
}

export interface UnderProductivityAlertData {
  triggered: boolean
  threshold: number
  currentValue: number
  affectedTeams: Array<string>
  since: string
}

export interface LowRevenueAlertData {
  triggered: boolean
  threshold: number
  currentValue: number
  percentageBelowThreshold: number
  since: string
}

export interface StorageThresholdAlertData {
  triggered: boolean
  threshold: number
  currentOccupancy: number
  affectedWarehouses: Array<{
    id: string
    name: string
    occupancy: number
  }>
}

export interface DefectRateAlertData {
  triggered: boolean
  threshold: number
  currentRate: number
  affectedProducts: Array<string>
  since: string
}

export interface InventoryDiscrepancyData {
  totalDiscrepancy: number
  discrepancyRate: number
  byProduct: Array<{
    productId: string
    productName: string
    expected: number
    actual: number
    discrepancy: number
  }>
}

export interface StockRotationData {
  averageRotationDays: number
  byCategory: Array<{
    category: string
    rotationDays: number
  }>
  slowMovingProducts: Array<{
    productId: string
    productName: string
    daysInStock: number
  }>
}

export interface OccupancyRateData {
  overallRate: number
  byWarehouse: Array<{
    warehouseId: string
    warehouseName: string
    occupancyRate: number
    capacity: number
    used: number
  }>
  trend: 'up' | 'down' | 'stable'
}

export interface DefectRateData {
  overallRate: number
  byCategory: Array<{
    category: string
    rate: number
  }>
  historical: Array<{
    date: string
    rate: number
  }>
}

export interface ReturnsAnalysisData {
  totalReturns: number
  returnRate: number
  byReason: Array<{
    reason: string
    count: number
    percentage: number
  }>
  byProduct: Array<{
    productId: string
    productName: string
    returnCount: number
    returnRate: number
  }>
}

// Mock API functions
export const api = {
  // Productivity endpoints
  async getAveragePreparationTime(
    actCode: ActivityCode,
    { startDate, endDate }: DateRange = getDefaultDateRange()
  ): Promise<PreparationTimeData> {
    return apiFetch<PreparationTimeData>(
      `/productivity/${actCode}/average-preparation-time?startDate=${startDate}&endDate=${endDate}`
    )
  },

  async getPiecesPerWorker(
    actCode: ActivityCode,
    teamId?: string
  ): Promise<PiecesPerWorkerData> {
    const endpoint = teamId
      ? `/productivity/${actCode}/pieces-per-worker?teamId=${teamId}`
      : `/productivity/${actCode}/pieces-per-worker`
    return apiFetch<PiecesPerWorkerData>(endpoint)
  },

  async getOnTimePreparationRate(
    actCode: ActivityCode,
    { startDate, endDate }: DateRange = getDefaultDateRange()
  ): Promise<OnTimePreparationData> {
    return apiFetch<OnTimePreparationData>(
      `/productivity/${actCode}/on-time-preparation-rate?startDate=${startDate}&endDate=${endDate}`
    )
  },

  // Financial endpoints
  async getRevenueComparison(
    actCode: ActivityCode,
    periods: {
      period1: DateRange;
      period2: DateRange;
    }
  ): Promise<RevenueComparisonData> {
    const { period1, period2 } = periods
    return apiFetch<RevenueComparisonData>(
      `/financial/${actCode}/revenue-comparison?startDate1=${period1.startDate}&endDate1=${period1.endDate}&startDate2=${period2.startDate}&endDate2=${period2.endDate}`
    )
  },

  async getShippingCost(
    actCode: ActivityCode,
    { startDate, endDate }: DateRange = getDefaultDateRange()
  ): Promise<ShippingCostData> {
    return apiFetch<ShippingCostData>(
      `/costs/${actCode}/shipping-cost?startDate=${startDate}&endDate=${endDate}`
    )
  },

  async getLogisticsCostEvolution(
    actCode: ActivityCode,
    { startDate, endDate }: DateRange = getDefaultDateRange()
  ): Promise<LogisticsCostEvolutionData> {
    return apiFetch<LogisticsCostEvolutionData>(
      `/costs/${actCode}/logistics-cost-evolution?startDate=${startDate}&endDate=${endDate}`
    )
  },

  async getLogisticsCostToRevenueRatio(
    actCode: ActivityCode,
    { startDate, endDate }: DateRange = getDefaultDateRange()
  ): Promise<LogisticsCostRatioData> {
    return apiFetch<LogisticsCostRatioData>(
      `/costs/${actCode}/logistics-cost-to-revenue-ratio?startDate=${startDate}&endDate=${endDate}`
    )
  },

  // Alert endpoints
  async getUnderProductivityAlert(
    actCode: ActivityCode,
    threshold?: number
  ): Promise<UnderProductivityAlertData> {
    const endpoint = threshold
      ? `/alerts/${actCode}/under-productivity?threshold=${threshold}`
      : `/alerts/${actCode}/under-productivity`
    return apiFetch<UnderProductivityAlertData>(endpoint)
  },

  async getLowRevenueAlert(
    actCode: ActivityCode,
    threshold?: number
  ): Promise<LowRevenueAlertData> {
    const endpoint = threshold
      ? `/alerts/${actCode}/low-revenue?threshold=${threshold}`
      : `/alerts/${actCode}/low-revenue`
    return apiFetch<LowRevenueAlertData>(endpoint)
  },

  async getStorageThresholdAlert(
    actCode: ActivityCode,
    threshold?: number
  ): Promise<StorageThresholdAlertData> {
    const endpoint = threshold
      ? `/alerts/${actCode}/storage-threshold?threshold=${threshold}`
      : `/alerts/${actCode}/storage-threshold`
    return apiFetch<StorageThresholdAlertData>(endpoint)
  },

  async getDefectRateAlert(
    actCode: ActivityCode,
    minRate?: number
  ): Promise<DefectRateAlertData> {
    const endpoint = minRate
      ? `/alerts/${actCode}/defect-rate-alert?minRate=${minRate}`
      : `/alerts/${actCode}/defect-rate-alert`
    return apiFetch<DefectRateAlertData>(endpoint)
  },

  // Stock & Storage endpoints
  async getInventoryDiscrepancy(
    actCode: ActivityCode
  ): Promise<InventoryDiscrepancyData> {
    return apiFetch<InventoryDiscrepancyData>(
      `/storage/${actCode}/inventory-discrepancy`
    )
  },

  async getStockRotation(
    actCode: ActivityCode
  ): Promise<StockRotationData> {
    return apiFetch<StockRotationData>(
      `/storage/${actCode}/stock-rotation`
    )
  },

  async getOccupancyRate(
    actCode: ActivityCode,
    warehouseId?: string
  ): Promise<OccupancyRateData> {
    const endpoint = warehouseId
      ? `/storage/${actCode}/occupancy-rate?warehouseId=${warehouseId}`
      : `/storage/${actCode}/occupancy-rate`
    return apiFetch<OccupancyRateData>(endpoint)
  },

  // Quality Assurance endpoints
  async getDefectRate(
    actCode: ActivityCode,
    productCategory?: string
  ): Promise<DefectRateData> {
    const endpoint = productCategory
      ? `/quality/${actCode}/defect-rate?productCategory=${productCategory}`
      : `/quality/${actCode}/defect-rate`
    return apiFetch<DefectRateData>(endpoint)
  },

  async getReturnsAnalysis(
    actCode: ActivityCode,
    reason?: string
  ): Promise<ReturnsAnalysisData> {
    const endpoint = reason
      ? `/quality/${actCode}/returns-analysis?reason=${reason}`
      : `/quality/${actCode}/returns-analysis`
    return apiFetch<ReturnsAnalysisData>(endpoint)
  },

  // Mock implementation of API calls
  mockApi: {
    getAveragePreparationTime(): PreparationTimeData {
      return {
        averageTimeMinutes: 32,
        dailyData: [
          { date: '2024-03-01', timeMinutes: 35 },
          { date: '2024-03-02', timeMinutes: 33 },
          { date: '2024-03-03', timeMinutes: 30 },
          { date: '2024-03-04', timeMinutes: 31 },
          { date: '2024-03-05', timeMinutes: 32 },
          { date: '2024-03-06', timeMinutes: 31 },
          { date: '2024-03-07', timeMinutes: 34 }
        ],
        previousPeriodAverage: 36,
        trend: 'down'
      }
    },

    getPiecesPerWorker(): PiecesPerWorkerData {
      return {
        average: 45,
        byTeam: [
          { teamId: 'TEAM_001', teamName: 'Alpha Team', piecesPerWorker: 52 },
          { teamId: 'TEAM_002', teamName: 'Beta Team', piecesPerWorker: 48 },
          { teamId: 'TEAM_003', teamName: 'Gamma Team', piecesPerWorker: 43 },
          { teamId: 'TEAM_004', teamName: 'Delta Team', piecesPerWorker: 38 }
        ]
      }
    },

    getOnTimePreparationRate(): OnTimePreparationData {
      return {
        rate: 92.5,
        trend: 'up',
        historical: [
          { date: '2024-03-01', rate: 90.2 },
          { date: '2024-03-02', rate: 91.5 },
          { date: '2024-03-03', rate: 91.8 },
          { date: '2024-03-04', rate: 92.1 },
          { date: '2024-03-05', rate: 92.3 },
          { date: '2024-03-06', rate: 92.7 },
          { date: '2024-03-07', rate: 92.5 }
        ]
      }
    },

    getRevenueComparison(): RevenueComparisonData {
      return {
        currentPeriod: {
          startDate: '2024-03-01',
          endDate: '2024-03-07',
          revenue: 248500
        },
        previousPeriod: {
          startDate: '2024-02-23',
          endDate: '2024-02-29',
          revenue: 232000
        },
        percentageChange: 7.1,
        dailyData: [
          { date: '2024-03-01', currentRevenue: 35000, previousRevenue: 32000 },
          { date: '2024-03-02', currentRevenue: 36500, previousRevenue: 33000 },
          { date: '2024-03-03', currentRevenue: 34000, previousRevenue: 34000 },
          { date: '2024-03-04', currentRevenue: 37000, previousRevenue: 33500 },
          { date: '2024-03-05', currentRevenue: 36000, previousRevenue: 32500 },
          { date: '2024-03-06', currentRevenue: 35000, previousRevenue: 33000 },
          { date: '2024-03-07', currentRevenue: 35000, previousRevenue: 34000 }
        ]
      }
    },

    getShippingCost(): ShippingCostData {
      return {
        totalCost: 58200,
        byCarrier: [
          { carrier: 'FastShip', cost: 18500, percentage: 31.8 },
          { carrier: 'ExpressLogistics', cost: 21700, percentage: 37.3 },
          { carrier: 'GlobalTransport', cost: 14000, percentage: 24.1 },
          { carrier: 'Other', cost: 4000, percentage: 6.9 }
        ],
        byDestination: [
          { destination: 'North', cost: 16800, percentage: 28.9 },
          { destination: 'South', cost: 14500, percentage: 24.9 },
          { destination: 'East', cost: 12300, percentage: 21.1 },
          { destination: 'West', cost: 10400, percentage: 17.9 },
          { destination: 'International', cost: 4200, percentage: 7.2 }
        ]
      }
    },

    getLogisticsCostEvolution(): LogisticsCostEvolutionData {
      return {
        totalCosts: [
          { date: '2024-03-01', cost: 12500 },
          { date: '2024-03-02', cost: 13200 },
          { date: '2024-03-03', cost: 12800 },
          { date: '2024-03-04', cost: 13500 },
          { date: '2024-03-05', cost: 13800 },
          { date: '2024-03-06', cost: 14200 },
          { date: '2024-03-07', cost: 14500 }
        ],
        byCategory: [
          {
            category: 'Transportation',
            costs: [
              { date: '2024-03-01', cost: 6200 },
              { date: '2024-03-02', cost: 6500 },
              { date: '2024-03-03', cost: 6300 },
              { date: '2024-03-04', cost: 6700 },
              { date: '2024-03-05', cost: 6900 },
              { date: '2024-03-06', cost: 7100 },
              { date: '2024-03-07', cost: 7200 }
            ]
          },
          {
            category: 'Warehousing',
            costs: [
              { date: '2024-03-01', cost: 4300 },
              { date: '2024-03-02', cost: 4400 },
              { date: '2024-03-03', cost: 4300 },
              { date: '2024-03-04', cost: 4500 },
              { date: '2024-03-05', cost: 4600 },
              { date: '2024-03-06', cost: 4700 },
              { date: '2024-03-07', cost: 4800 }
            ]
          },
          {
            category: 'Labor',
            costs: [
              { date: '2024-03-01', cost: 2000 },
              { date: '2024-03-02', cost: 2300 },
              { date: '2024-03-03', cost: 2200 },
              { date: '2024-03-04', cost: 2300 },
              { date: '2024-03-05', cost: 2300 },
              { date: '2024-03-06', cost: 2400 },
              { date: '2024-03-07', cost: 2500 }
            ]
          }
        ]
      }
    },

    getLogisticsCostToRevenueRatio(): LogisticsCostRatioData {
      return {
        ratio: 23.4,
        trend: 'down',
        historical: [
          { date: '2024-03-01', ratio: 24.5 },
          { date: '2024-03-02', ratio: 24.2 },
          { date: '2024-03-03', ratio: 24.0 },
          { date: '2024-03-04', ratio: 23.8 },
          { date: '2024-03-05', ratio: 23.6 },
          { date: '2024-03-06', ratio: 23.5 },
          { date: '2024-03-07', ratio: 23.4 }
        ]
      }
    },

    getUnderProductivityAlert(): UnderProductivityAlertData {
      return {
        triggered: true,
        threshold: 35,
        currentValue: 32,
        affectedTeams: ['Delta Team', 'Echo Team'],
        since: '2024-03-05'
      }
    },

    getLowRevenueAlert(): LowRevenueAlertData {
      return {
        triggered: false,
        threshold: 30000,
        currentValue: 35000,
        percentageBelowThreshold: 0,
        since: ''
      }
    },

    getStorageThresholdAlert(): StorageThresholdAlertData {
      return {
        triggered: true,
        threshold: 85,
        currentOccupancy: 89,
        affectedWarehouses: [
          { id: 'WH_EAST', name: 'East Warehouse', occupancy: 89 },
          { id: 'WH_NORTH', name: 'North Warehouse', occupancy: 87 }
        ]
      }
    },

    getDefectRateAlert(): DefectRateAlertData {
      return {
        triggered: true,
        threshold: 3,
        currentRate: 3.8,
        affectedProducts: ['Product X-123', 'Product Y-456'],
        since: '2024-03-03'
      }
    },

    getInventoryDiscrepancy(): InventoryDiscrepancyData {
      return {
        totalDiscrepancy: 357,
        discrepancyRate: 2.4,
        byProduct: [
          { productId: 'P1001', productName: 'Premium Widget A', expected: 1200, actual: 1185, discrepancy: -15 },
          { productId: 'P1002', productName: 'Premium Widget B', expected: 950, actual: 932, discrepancy: -18 },
          { productId: 'P1003', productName: 'Standard Widget X', expected: 2300, actual: 2260, discrepancy: -40 },
          { productId: 'P1004', productName: 'Standard Widget Y', expected: 1800, actual: 1753, discrepancy: -47 },
          { productId: 'P1005', productName: 'Economy Widget', expected: 3500, actual: 3420, discrepancy: -80 }
        ]
      }
    },

    getStockRotation(): StockRotationData {
      return {
        averageRotationDays: 18,
        byCategory: [
          { category: 'Premium Widgets', rotationDays: 12 },
          { category: 'Standard Widgets', rotationDays: 18 },
          { category: 'Economy Widgets', rotationDays: 24 },
          { category: 'Accessories', rotationDays: 30 }
        ],
        slowMovingProducts: [
          { productId: 'P2001', productName: 'Specialty Widget Q', daysInStock: 45 },
          { productId: 'P2002', productName: 'Limited Edition Kit', daysInStock: 38 },
          { productId: 'P2003', productName: 'Advanced Accessory Pack', daysInStock: 36 }
        ]
      }
    },

    getOccupancyRate(): OccupancyRateData {
      return {
        overallRate: 78,
        byWarehouse: [
          { warehouseId: 'WH_EAST', warehouseName: 'East Warehouse', occupancyRate: 89, capacity: 5000, used: 4450 },
          { warehouseId: 'WH_WEST', warehouseName: 'West Warehouse', occupancyRate: 72, capacity: 6000, used: 4320 },
          { warehouseId: 'WH_NORTH', warehouseName: 'North Warehouse', occupancyRate: 87, capacity: 4500, used: 3915 },
          { warehouseId: 'WH_SOUTH', warehouseName: 'South Warehouse', occupancyRate: 70, capacity: 5500, used: 3850 }
        ],
        trend: 'up'
      }
    },

    getDefectRate(): DefectRateData {
      return {
        overallRate: 2.8,
        byCategory: [
          { category: 'Premium Widgets', rate: 1.3 },
          { category: 'Standard Widgets', rate: 2.7 },
          { category: 'Economy Widgets', rate: 3.8 },
          { category: 'Accessories', rate: 2.1 }
        ],
        historical: [
          { date: '2024-03-01', rate: 2.5 },
          { date: '2024-03-02', rate: 2.6 },
          { date: '2024-03-03', rate: 2.8 },
          { date: '2024-03-04', rate: 2.7 },
          { date: '2024-03-05', rate: 2.9 },
          { date: '2024-03-06', rate: 2.8 },
          { date: '2024-03-07', rate: 2.8 }
        ]
      }
    },

    getReturnsAnalysis(): ReturnsAnalysisData {
      return {
        totalReturns: 348,
        returnRate: 3.2,
        byReason: [
          { reason: 'DEFECTIVE', count: 156, percentage: 44.8 },
          { reason: 'INCORRECT_ITEM', count: 82, percentage: 23.6 },
          { reason: 'DAMAGED_IN_TRANSIT', count: 65, percentage: 18.7 },
          { reason: 'CUSTOMER_DISSATISFACTION', count: 28, percentage: 8.0 },
          { reason: 'OTHER', count: 17, percentage: 4.9 }
        ],
        byProduct: [
          { productId: 'P1003', productName: 'Standard Widget X', returnCount: 72, returnRate: 3.9 },
          { productId: 'P1005', productName: 'Economy Widget', returnCount: 95, returnRate: 4.2 },
          { productId: 'P1002', productName: 'Premium Widget B', returnCount: 32, returnRate: 2.1 },
          { productId: 'P1001', productName: 'Premium Widget A', returnCount: 26, returnRate: 1.7 }
        ]
      }
    }
  }
}

// Export mocked API for development
export default api
