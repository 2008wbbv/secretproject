// API Route: /api/colleges.js
// This should be placed in: pages/api/colleges.js (Next.js) or api/colleges.js (Vercel)

export default async function handler(req, res) {
  try {
    const API_KEY = process.env.COLLEGE_API_KEY || "CSA2QVNf9JBa5GwfBxAmdq0osOR6ghDMo0L9MRT7";
    const query = req.query.q || "";
    
    // Base API URL
    const baseUrl = "https://api.data.gov/ed/collegescorecard/v1/schools";
    
    // Build query parameters
    const params = new URLSearchParams({
      api_key: API_KEY,
      "school.degrees_awarded.predominant": "3", // Bachelor's degree granting
      "fields": [
        "id",
        "school.name",
        "school.city",
        "school.state",
        "school.school_url",
        "school.ownership",
        "school.carnegie_basic",
        "school.locale",
        "2022.admissions.admission_rate.overall",
        "2022.admissions.sat_scores.average.overall",
        "2022.admissions.act_scores.midpoint.cumulative",
        "2022.student.size",
        "2022.cost.avg_net_price.overall",
        "2022.cost.tuition.in_state",
        "2022.cost.tuition.out_of_state",
        "2022.completion.completion_rate_4yr_150nt",
        "2022.student.retention_rate_suppressed.four_year.full_time",
        "2022.earnings.6_yrs_after_entry.median"
      ].join(","),
      "per_page": "50"
    });

    // Add search query if provided (minimum 3 characters)
    if (query && query.length >= 3) {
      params.append("school.name", query);
    } else {
      // Default: show top schools by admission rate
      params.append("2022.admissions.admission_rate.overall__range", "0..1");
      params.append("2022.student.size__range", "1000..");
      params.append("sort", "2022.admissions.admission_rate.overall:asc");
    }

    // Make request to College Scorecard API
    const url = `${baseUrl}?${params.toString()}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`College Scorecard API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the results
    res.status(200).json({
      results: data.results || [],
      metadata: {
        total: data.metadata?.total || 0,
        page: data.metadata?.page || 0,
        per_page: data.metadata?.per_page || 50
      }
    });
    
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ 
      results: [],
      error: err.message 
    });
  }
}
