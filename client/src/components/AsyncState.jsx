export default function AsyncState({loading,error,retry,empty=false}) {
  if(loading) return <p className="async-state" role="status">Loading dogs…</p>;
  if(error) return <div className="async-state" role="alert"><p>{error}</p><button className="home-btn home-btn--outline" onClick={retry}>Try again</button></div>;
  if(empty) return <p className="async-state" role="status">No dogs found. Please try another search or check back later.</p>;
  return null;
}
