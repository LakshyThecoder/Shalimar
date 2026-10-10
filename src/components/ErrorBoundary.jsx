import { Component } from "react";

/** Prevents a full blank white screen if a render throws */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Shalimar UI crash:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#0a0908",
            color: "#f2ede6",
            padding: "2rem",
            fontFamily: "system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <div>
            <p style={{ color: "#e8a317", fontStyle: "italic", marginBottom: "0.5rem" }}>शालिमार</p>
            <h1 style={{ fontSize: "2rem", margin: "0 0 1rem" }}>SHALIMAR</h1>
            <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
              Something went wrong loading the page.
            </p>
            <a
              href="/"
              style={{
                display: "inline-block",
                background: "#e8a317",
                color: "#0a0908",
                padding: "0.75rem 1.25rem",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              Reload homepage
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
