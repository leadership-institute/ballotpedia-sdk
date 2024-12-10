export interface BallotpediaDistrict {
  id: string
  name: string
  type:
    | 'Congress'
    | 'State Legislative (Lower)'
    | 'State'
    | 'County'
    | 'Judicial district subdivision'
    | 'City-town'
    | 'School District'
    | 'Country'
    | 'City-town subdivision'
    | 'State Legislative (Upper)'
  url: string
  ocdid: string | null
  nces_id: string | null
  geo_id: string | null
  state: string
  end_date: string | null
}

export interface DistrictsResponse {
  success: boolean
  data: BallotpediaDistrict[]
  message: string | null
}

export interface RequestOptions {
  collections?: string[]
  officeLevels?: ('Federal' | 'State' | 'Local')[]
  officeBranches?: ('Legislative' | 'Executive' | 'Judicial')[]
  districtTypes?: (
    | 'Country'
    | 'Congress'
    | 'State'
    | 'State Legislative (Upper)'
    | 'State Legislative (Lower)'
    | 'Judicial District'
    | 'County'
    | 'County subdivision'
    | 'City-town'
    | 'School District'
    | 'State subdivision'
    | 'Special district subdivision'
    | 'Judicial district subdivision'
    | 'Special District'
    | 'City-town subdivision'
    | 'School district subdivision'
  )[]
  page?: number
}

export interface ElectionDateOptions {
  state?: string
  type?: ('General' | 'Primary' | 'Special' | 'Recall')[]
  year?: number
  page?: number
}

export interface BallotpediaElection {
  id: number
  date: string
  type: 'Special' | 'General' | 'Primary' | 'Recall' | 'General Runoff'
  description: string
  candidate_lists_complete: boolean
  district_name: string
  district_type:
    | 'School District'
    | 'State'
    | 'City-town'
    | 'County subdivision'
    | 'County'
    | 'City-town subdivision'
  state: string
}

export interface ElectionDatesResponse {
  success: boolean
  data: {
    total_pages: number
    elections: BallotpediaElection[]
  }
  message: string | null
}
