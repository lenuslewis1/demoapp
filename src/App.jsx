import { useMemo, useState } from "react";

const opportunities = [
  {
    id: 1,
    title: "Frontend Developer Internship",
    type: "Internship",
    domain: "Technology",
    level: "Beginner",
    location: "Remote",
    tags: ["React", "JavaScript", "Web"]
  },
  {
    id: 2,
    title: "AI Research Assistant",
    type: "Research",
    domain: "Data Science",
    level: "Intermediate",
    location: "On-site",
    tags: ["Python", "Machine Learning", "NLP"]
  },
  {
    id: 3,
    title: "Campus Marketing Ambassador",
    type: "Part-time",
    domain: "Marketing",
    level: "Beginner",
    location: "Hybrid",
    tags: ["Communication", "Social Media", "Branding"]
  },
  {
    id: 4,
    title: "Cybersecurity Bootcamp Scholarship",
    type: "Scholarship",
    domain: "Technology",
    level: "Beginner",
    location: "Remote",
    tags: ["Security", "Networking", "Linux"]
  },
  {
    id: 5,
    title: "Product Management Fellowship",
    type: "Fellowship",
    domain: "Business",
    level: "Intermediate",
    location: "Remote",
    tags: ["Leadership", "Roadmapping", "Analytics"]
  },
  {
    id: 6,
    title: "Sustainability Innovation Challenge",
    type: "Competition",
    domain: "Environment",
    level: "Advanced",
    location: "Hybrid",
    tags: ["Innovation", "Pitching", "Problem-solving"]
  }
];

const initialProfile = {
  interests: "",
  skillLevel: "Any",
  preferredType: "Any",
  location: "Any"
};

export default function App() {
  const [profile, setProfile] = useState(initialProfile);

  const matches = useMemo(() => {
    const interestTerms = profile.interests
      .split(",")
      .map((term) => term.trim().toLowerCase())
      .filter(Boolean);

    return opportunities
      .map((opportunity) => {
        let score = 0;

        if (profile.skillLevel === "Any" || profile.skillLevel === opportunity.level) {
          score += 2;
        }

        if (profile.preferredType === "Any" || profile.preferredType === opportunity.type) {
          score += 2;
        }

        if (profile.location === "Any" || profile.location === opportunity.location) {
          score += 1;
        }

        const searchableText = [opportunity.domain, ...opportunity.tags, opportunity.title]
          .join(" ")
          .toLowerCase();

        const interestHits = interestTerms.reduce(
          (count, term) => (searchableText.includes(term) ? count + 1 : count),
          0
        );

        score += interestHits * 2;

        return {
          ...opportunity,
          score,
          matchReason:
            interestHits > 0
              ? `Matched ${interestHits} interest${interestHits > 1 ? "s" : ""} from your profile.`
              : "Matched based on your preferred level/type/location."
        };
      })
      .filter((opportunity) => opportunity.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [profile]);

  const updateProfile = (field) => (event) => {
    setProfile((previous) => ({
      ...previous,
      [field]: event.target.value
    }));
  };

  return (
    <main className="page">
      <section className="hero">
        <h1>Student Opportunity Finder</h1>
        <p>
          Add your interests and preferences to discover internships, scholarships, fellowships, and
          competitions that align with your profile.
        </p>
      </section>

      <section className="card profile-form">
        <h2>Your Profile</h2>
        <div className="grid">
          <label>
            Interests (comma-separated)
            <input
              type="text"
              placeholder="e.g. React, AI, Marketing"
              value={profile.interests}
              onChange={updateProfile("interests")}
            />
          </label>

          <label>
            Skill Level
            <select value={profile.skillLevel} onChange={updateProfile("skillLevel")}>
              <option>Any</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>

          <label>
            Opportunity Type
            <select value={profile.preferredType} onChange={updateProfile("preferredType")}>
              <option>Any</option>
              <option>Internship</option>
              <option>Research</option>
              <option>Part-time</option>
              <option>Scholarship</option>
              <option>Fellowship</option>
              <option>Competition</option>
            </select>
          </label>

          <label>
            Preferred Location
            <select value={profile.location} onChange={updateProfile("location")}>
              <option>Any</option>
              <option>Remote</option>
              <option>Hybrid</option>
              <option>On-site</option>
            </select>
          </label>
        </div>
      </section>

      <section className="card">
        <div className="results-heading">
          <h2>Recommended Opportunities</h2>
          <span>{matches.length} matches</span>
        </div>

        <ul className="results">
          {matches.map((match) => (
            <li key={match.id} className="result-item">
              <div>
                <h3>{match.title}</h3>
                <p className="meta">
                  {match.type} · {match.domain} · {match.level} · {match.location}
                </p>
                <p>{match.matchReason}</p>
                <div className="tag-list">
                  {match.tags.map((tag) => (
                    <span key={tag} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <strong className="score">Match Score: {match.score}</strong>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
