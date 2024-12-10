# Ballotpedia SDK

A TypeScript SDK for interacting with the Ballotpedia API v4. This SDK provides a simple interface to access election data, districts, officeholders, and more from Ballotpedia.

This SDK is simply a wrapper around the [Ballotpedia API](https://developer.ballotpedia.org/).

## Installation

```bash
pnpm install ballotpedia-sdk
```


## Usage

```ts
import BallotpediaService from 'ballotpedia-sdk';

const ballotpedia = new BallotpediaService({
  apiKey: 'your-api-key-here'
});
```


### Getting Districts

Fetch voting districts for a specific location:
```typescript
try {
  const districts = await ballotpedia.getDistricts(37.7749, -122.4194);
  console.log(districts.data);
} catch (error) {
  console.error('Error fetching districts:', error);
}
```


### Getting Officeholders

Fetch current officeholders for a location:

```typescript
try {
  const officeholders = await ballotpedia.getOfficeholders(37.7749, -122.4194, {
    collections: ['Federal', 'State']
  });
  console.log(officeholders.data);
} catch (error) {
  console.error('Error fetching officeholders:', error);
}
```


### Getting Election Dates

Fetch election dates by location:
```ts
try {
  const dates = await ballotpedia.getElectionDatesByPoint(37.7749, -122.4194);
  console.log(dates.data);
} catch (error) {
  console.error('Error fetching election dates:', error);
}
```


Or fetch election dates by parameters:
```typescript
try {
  const dates = await ballotpedia.getElectionDates({
    state: 'California',
    type: ['General', 'Primary'],
    year: 2024
  });
  console.log(dates.data);
} catch (error) {
  console.error('Error fetching election dates:', error);
}
```


### Getting Elections

Fetch elections by location:
```typescript
try {
  const elections = await ballotpedia.getElectionsByPoint(
    37.7749,
    -122.4194,
    '2024-11-05',
    {
      collections: ['Federal', 'State']
    }
  );
  console.log(elections.data);
} catch (error) {
  console.error('Error fetching elections:', error);
}

```
Or fetch elections by state:

```ts
try {
  const elections = await ballotpedia.getElectionsByState(
    'California',
    '2024-11-05',
    {
      collections: ['Federal', 'State'],
      officeLevels: ['Federal', 'State'],
      officeBranches: ['Legislative', 'Executive']
    }
  );
  console.log(elections.data);
} catch (error) {
  console.error('Error fetching elections:', error);
}
```


## Error Handling

The SDK provides three types of errors for better error handling:

- `BallotpediaError`: Base error class for general errors
- `BallotpediaAPIError`: For API-specific errors (includes status code and text)
- `BallotpediaValidationError`: For input validation errors

```ts
try {
  const districts = await ballotpedia.getDistricts(lat, long);
} catch (error) {
  if (error instanceof BallotpediaAPIError) {
    console.error(`API Error ${error.statusCode}: ${error.message}`);
  } else if (error instanceof BallotpediaValidationError) {
    console.error(`Validation Error: ${error.message}`);
  } else if (error instanceof BallotpediaError) {
    console.error(`General Error: ${error.message}`);
  }
}
```

## API Reference

| Method | Description |
|--------|-------------|
| `getDistricts(lat: number, long: number)` | Fetches voting districts for a specific latitude and longitude. |
| `getOfficeholders(lat: number, long: number, options?: RequestOptions)` | Fetches current officeholders for a location with optional filtering. |
| `getElectionDatesByPoint(lat: number, long: number)` | Fetches election dates for a specific latitude and longitude. |
| `getElectionDates(options?: ElectionDateOptions)` | Fetches election dates based on provided parameters. |
| `getElectionsByPoint(lat: number, long: number, electionDate: string, options?: RequestOptions)` | Fetches elections for a specific location and date. |
| `getElectionsByState(state: string, electionDate: string, options?: RequestOptions)` | Fetches elections for a specific state and date. |


## Types

### RequestOptions
```typescript
interface RequestOptions {
  collections?: string[];
  officeLevels?: ('Federal' | 'State' | 'Local')[];
  officeBranches?: ('Legislative' | 'Executive' | 'Judicial')[];
  districtTypes?: string[];
  page?: number;
}
```

### ElectionDateOptions
```typescript
interface ElectionDateOptions {
  state?: string;
  type?: ('General' | 'Primary' | 'Special' | 'Recall')[];
  year?: number;
  page?: number;
}
```

