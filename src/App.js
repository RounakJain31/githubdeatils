import React, { useState } from "react";

export default function App() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setUserData(null);

    const u = username.trim();
    if (!u) {
      setError("Please enter a Github username.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://api.github.com/users/${u}`);

      if (res.status === 404) {
        setError("User not found");
        return;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const data = await res.json();
      setUserData(data);
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 700, margin: "40px auto", fontFamily: "Arial, Helvetica, sans-serif", padding: 16 }}>
      <h1>GitHub User Finder</h1>
      <p>Search a Github username to see profile details.</p>

      <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
        <input
          name="username"
          placeholder="e.g. torvalds, gaearon, octocat"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: 8, width: "65%", marginRight: 8 }}
        />
        <button type="submit" style={{ padding: "8px 12px", marginRight: 8 }}>Search</button>
        <button type="button" onClick={() => { setUsername(""); setUserData(null); setError(""); }} style={{ padding: "8px 12px" }}>
          Reset
        </button>
      </form>

      {!userData && !loading && !error && <p>No user yet. Try searching for 'octocat'.</p>}

      {loading && <p>Loading...</p>}

      {error && <p style={{ color: "red", fontWeight: 600 }}>{error}</p>}

      {userData && (
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start", border: "1px solid #ddd", padding: 16, borderRadius: 8 }}>
          <img src={userData.avatar_url} alt={`${userData.login} avatar`} width={120} height={120} style={{ borderRadius: 8 }} />
          <div>
            <h2 style={{ margin: 0 }}>{userData.name || userData.login}</h2>
            {userData.bio && <p style={{ marginTop: 6 }}>{userData.bio}</p>}
            <p style={{ marginTop: 8 }}>
             <b> {userData.followers} </b> <span>Followers</span> &nbsp;
             <b> {userData.following} </b> <span>Following</span> &nbsp;
             <b> {userData.public_repos} </b> <span>Repos</span> 
            </p>
            <p style={{ marginTop: 8 }}>
              <a href={userData.html_url} target="_blank" rel="noreferrer">View Profile</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
