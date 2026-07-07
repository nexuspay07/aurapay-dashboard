import Input from "../components/ui/Input";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function InputTest() {
  return (
    <div
      style={{
        maxWidth: 650,
        margin: "40px auto",
        display: "grid",
        gap: 24,
      }}
    >
      <Card
        title="AuraPay Input Component"
        subtitle="Production Design System"
      >
        <div
          style={{
            display: "grid",
            gap: 20,
          }}
        >
          <Input
            label="Email Address"
            placeholder="john@example.com"
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter password"
          />

          <Input
            label="Merchant Name"
            helperText="This name appears on customer receipts."
            placeholder="Aura Technologies"
          />

          <Input
            label="Business Email"
            error="Email already exists."
            placeholder="merchant@email.com"
          />

          <Button fullWidth>
            Continue
          </Button>
        </div>
      </Card>
    </div>
  );
}