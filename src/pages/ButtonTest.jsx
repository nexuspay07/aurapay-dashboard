import Button from "../components/ui/Button";

export default function ButtonTest() {
  return (
    <div
      style={{
        padding: 60,
        display: "grid",
        gap: 20,
        maxWidth: 500,
      }}
    >
      <Button>
        Primary Button
      </Button>

      <Button variant="secondary">
        Secondary Button
      </Button>

      <Button variant="success">
        Success Button
      </Button>

      <Button variant="danger">
        Danger Button
      </Button>

      <Button variant="outline">
        Outline Button
      </Button>

      <Button variant="ghost">
        Ghost Button
      </Button>

      <Button loading>
        Loading Button
      </Button>

      <Button fullWidth>
        Full Width Button
      </Button>
    </div>
  );
}