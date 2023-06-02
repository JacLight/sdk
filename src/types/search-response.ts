export interface SearchResponse<T> {
    body?: {
        took?: number;
        timed_out?: boolean;
        _shards?: {
            total?: number;
            successful?: number;
            skipped?: number;
            failed?: number;
        };
        hits?: {
            total?: {
                value?: number;
                relation?: string;
            };
            max_score?: number;
            hits?: Array<{
                _index?: string;
                _type?: string;
                _id?: string;
                _score?: number;
                _source?: T;
            }>;
        };
    },
    hasMore?: boolean;
    query?: {
        datatype?: string;
        query?: {};
        from?: number;
        size?: number;
    };
}