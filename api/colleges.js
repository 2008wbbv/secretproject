export default async function handler(req, res) {
  try {
    const API_KEY = process.env.COLLEGE_API_KEY;
    const query = req.query.q || "";

    let url =
      "https://api.data.gov/ed/collegescorecard/v1/schools" +
      "?api_key=" + API_KEY +
      "&school.degrees_awarded.predominant=3" +
      "&fields=id,school.name,school.city,school.state,school.school_url," +
      "school.ownership,school.carnegie_basic,school.locale," +
      "2022.admissions.admission_rate.overall," +
      "2022.admissions.sat_scores.average.overall," +
      "2022.admissions.act_scores.midpoint.cumulative," +
      "2022.student.size," +
      "2022.cost.avg_net_price.overall," +
      "2022.cost.tuition.in_state," +
      "2022.cost.tuition.out_of_state," +
      "2022.completion.completion_rate_4yr_150nt," +
      "2022.student.retention_rate_suppressed.four_year.full_time," +
      "2022.earnings.6_yrs_after_entry.median" +
      "&per_page=20";

    // 🔍 LIVE SEARCH
    if (query) {
      url += "&school.name=" + encodeURIComponent(query);
    }

    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json({
      results: data.results || []
    });
  } catch (err) {
    res.status(500).json({ results: [] });
  }
}
