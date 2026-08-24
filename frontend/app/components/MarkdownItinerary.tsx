import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MarkdownItinerary({ content }: { content: string }) {
  return (
    <div className="itinerary-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ node, children, ...props }) => {
            const text = String(children).replace(/\n/g, "").trim();
            const isDayHeader = /^Day\s+\d+/i.test(text);

            if (isDayHeader) {
              const splitIndex = text.indexOf(":");
              const dayBadge = splitIndex !== -1 ? text.substring(0, splitIndex) : "DAY";
              const dayTitle = splitIndex !== -1 ? text.substring(splitIndex + 1).trim() : text;

              return (
                <div
                  style={{
                    marginTop: "2.5rem",
                    marginBottom: "1.25rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span
                      style={{
                        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                        color: "#fff",
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        padding: "5px 12px",
                        borderRadius: 8,
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        boxShadow: "0 0 16px rgba(124,58,237,0.4)",
                        flexShrink: 0,
                      }}
                    >
                      {dayBadge}
                    </span>
                    <h2
                      style={{
                        fontSize: "1.1rem",
                        fontWeight: 700,
                        color: "#f1f5f9",
                        margin: 0,
                      }}
                      {...props}
                    >
                      {dayTitle}
                    </h2>
                  </div>
                </div>
              );
            }

            return (
              <h2
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#e2e8f0",
                  marginTop: "2rem",
                  marginBottom: "0.75rem",
                  paddingLeft: "0.875rem",
                  borderLeft: "3px solid #7c3aed",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
                {...props}
              >
                {children}
              </h2>
            );
          },

          h3: ({ node, children, ...props }) => (
            <h3
              style={{
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#c4b5fd",
                marginTop: "1.25rem",
                marginBottom: "0.5rem",
              }}
              {...props}
            >
              {children}
            </h3>
          ),

          p: ({ node, children, ...props }) => (
            <p
              style={{
                color: "rgba(148,163,184,0.85)",
                lineHeight: 1.8,
                fontSize: "0.9rem",
                marginBottom: "0.6rem",
              }}
              {...props}
            >
              {children}
            </p>
          ),

          li: ({ node, children, ...props }) => (
            <li
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginBottom: "0.4rem",
                listStyle: "none",
                color: "rgba(148,163,184,0.85)",
                fontSize: "0.875rem",
                lineHeight: 1.7,
              }}
              {...props}
            >
              <span
                style={{
                  color: "#7c3aed",
                  fontSize: "1.1rem",
                  lineHeight: 1.4,
                  flexShrink: 0,
                }}
              >
                ›
              </span>
              <span>{children}</span>
            </li>
          ),

          ul: ({ node, children, ...props }) => (
            <ul style={{ paddingLeft: 0, marginBottom: "0.75rem" }} {...props}>
              {children}
            </ul>
          ),

          strong: ({ node, children, ...props }) => (
            <strong style={{ color: "#e2e8f0", fontWeight: 600 }} {...props}>
              {children}
            </strong>
          ),

          table: ({ node, ...props }) => (
            <div style={{ overflowX: "auto", margin: "1.5rem 0", borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }} {...props} />
            </div>
          ),

          th: ({ node, ...props }) => (
            <th
              style={{
                background: "rgba(124,58,237,0.18)",
                color: "#c4b5fd",
                padding: "0.75rem 1rem",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
                fontSize: "0.72rem",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                fontWeight: 700,
                textAlign: "left",
              }}
              {...props}
            />
          ),

          td: ({ node, ...props }) => (
            <td
              style={{
                color: "rgba(148,163,184,0.85)",
                padding: "0.65rem 1rem",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                fontSize: "0.85rem",
              }}
              {...props}
            />
          ),

          hr: () => (
            <hr
              style={{
                border: "none",
                borderTop: "1px solid rgba(255,255,255,0.06)",
                margin: "1.5rem 0",
              }}
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}