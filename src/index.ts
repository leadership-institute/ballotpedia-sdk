import { BallotpediaError, BallotpediaAPIError, BallotpediaValidationError } from './errors';
import { BallotpediaElection, ElectionDatesResponse, RequestOptions, ElectionDateOptions, DistrictsResponse } from './types'

const BASE_URL = 'https://api4.ballotpedia.org/data/'

class BallotpediaService {

  private apiKey: string
  private headers: Record<string, string>

  constructor({ apiKey }: { apiKey: string }) {
    if (!apiKey) {
      throw new BallotpediaValidationError('API key is required');
    }
    this.apiKey = apiKey
    this.headers = {
      'x-api-key': this.apiKey,
      'Content-Type': 'application/json'
    }
  }

  private validateCoordinates(lat: number, long: number) {
    if (lat < -90 || lat > 90) {
      throw new BallotpediaValidationError('Latitude must be between -90 and 90 degrees');
    }
    if (long < -180 || long > 180) {
      throw new BallotpediaValidationError('Longitude must be between -180 and 180 degrees');
    }
  }

  private async handleResponse<T>(response: Response, errorMessage: string): Promise<T> {
    if (!response.ok) {
      throw new BallotpediaAPIError(
        errorMessage,
        response.status,
        response.statusText
      );
    }

    try {
      const data = await response.json();
      if (!data.success) {
        throw new BallotpediaError(data.message || 'Unknown API error');
      }
      return data;
    } catch (error) {
      if (error instanceof BallotpediaError) {
        throw error;
      }
      throw new BallotpediaError('Failed to parse API response');
    }
  }

  // Get voting districts for a location
  async getDistricts(lat: number, long: number): Promise<DistrictsResponse> {
    try {
      this.validateCoordinates(lat, long);
      const response = await fetch(
        `${BASE_URL}districts/point?lat=${lat}&long=${long}`,
        { headers: this.headers }
      )
      return this.handleResponse<DistrictsResponse>(
        response,
        'Failed to fetch districts'
      );
    } catch (error) {
      if (error instanceof BallotpediaError) {
        throw error;
      }
      throw new BallotpediaError('Failed to fetch districts');
    }
  }

  // Get current officeholders for a location
  async getOfficeholders(lat: number, long: number, options?: RequestOptions) {
    try {
      this.validateCoordinates(lat, long);
      const collections = options?.collections?.join(',')
      const url = `${BASE_URL}officeholders?lat=${lat}&long=${long}${collections ? `&collections=${collections}` : ''
        }`
      const response = await fetch(url, { headers: this.headers })
      return this.handleResponse(response, 'Failed to fetch officeholders');
    } catch (error) {
      if (error instanceof BallotpediaError) {
        throw error;
      }
      throw new BallotpediaError('Failed to fetch officeholders');
    }
  }

  // Get election dates for a location
  async getElectionDatesByPoint(lat: number, long: number) {
    try {
      this.validateCoordinates(lat, long);
      const response = await fetch(
        `${BASE_URL}election_dates/point?lat=${lat}&long=${long}`,
        { headers: this.headers }
      )
      return this.handleResponse(response, 'Failed to fetch election dates');
    } catch (error) {
      if (error instanceof BallotpediaError) {
        throw error;
      }
      throw new BallotpediaError('Failed to fetch election dates');
    }
  }

  // Get election dates by parameters
  async getElectionDates(options?: ElectionDateOptions): Promise<ElectionDatesResponse> {
    try {
      const params = new URLSearchParams()
      if (options?.state) params.append('state', options.state)
      if (options?.type) params.append('type', options.type.join(','))
      if (options?.year) {
        if (options.year < 1776 || options.year > 9999) {
          throw new BallotpediaValidationError('Invalid year specified');
        }
        params.append('year', options.year.toString())
      }
      if (options?.page) {
        if (options.page < 1) {
          throw new BallotpediaValidationError('Page number must be greater than 0');
        }
        params.append('page', options.page.toString())
      }

      const response = await fetch(
        `${BASE_URL}election_dates/list${params.toString() ? `?${params}` : ''}`,
        { headers: this.headers }
      )
      return this.handleResponse<ElectionDatesResponse>(
        response,
        'Failed to fetch election dates'
      );
    } catch (error) {
      if (error instanceof BallotpediaError) {
        throw error;
      }
      throw new BallotpediaError('Failed to fetch election dates');
    }
  }

  // Get election ballots and results by point
  async getElectionsByPoint(lat: number, long: number, electionDate: string, options?: RequestOptions) {
    try {
      this.validateCoordinates(lat, long);
      const collections = options?.collections?.join(',')
      const url = `${BASE_URL}elections/point?lat=${lat}&long=${long}&election_date=${electionDate}${collections ? `&collections=${collections}` : ''
        }`
      const response = await fetch(url, { headers: this.headers })
      return this.handleResponse(response, 'Failed to fetch elections');
    } catch (error) {
      if (error instanceof BallotpediaError) {
        throw error;
      }
      throw new BallotpediaError('Failed to fetch elections');
    }
  }

  // Get election ballots and results by state
  async getElectionsByState(state: string, electionDate: string, options?: RequestOptions) {
    try {
      if (!state) {
        throw new BallotpediaValidationError('State is required');
      }
      if (!electionDate) {
        throw new BallotpediaValidationError('Election date is required');
      }

      const params = new URLSearchParams()
      params.append('state', state)
      params.append('election_date', electionDate)

      if (options?.collections) params.append('collections', options.collections.join(','))
      if (options?.officeLevels) params.append('office_level', options.officeLevels.join(','))
      if (options?.officeBranches) params.append('office_branch', options.officeBranches.join(','))
      if (options?.districtTypes) params.append('district_type', options.districtTypes.join(','))
      if (options?.page) {
        if (options.page < 1) {
          throw new BallotpediaValidationError('Page number must be greater than 0');
        }
        params.append('page', options.page.toString())
      }

      const response = await fetch(
        `${BASE_URL}elections/statewide?${params}`,
        { headers: this.headers }
      )
      return this.handleResponse(response, 'Failed to fetch elections');
    } catch (error) {
      if (error instanceof BallotpediaError) {
        throw error;
      }
      throw new BallotpediaError('Failed to fetch elections');
    }
  }
}

export default BallotpediaService
