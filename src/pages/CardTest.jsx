import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function CardTest() {
  return (
    <div
      style={{
        padding: 50,
        display: "grid",
        gap: 25,
        maxWidth: 900,
      }}
    >
      <Card
        title="Wallet Balance"
        subtitle="Available balance"
      >
        <h1>$12,540.23</h1>
      </Card>

      <Card
        title="Revenue"
        subtitle="Today's earnings"
        hover
      >
        <h1>$4,260</h1>

        <p>
          ↑ 12% from yesterday
        </p>
      </Card>

      <Card
        title="Merchant Actions"
        footer={
          <Button>
            Create Checkout
          </Button>
        }
      >
        <p>
          Generate secure payment
          links for your
          customers.
        </p>
      </Card>

      <Card
        hover
        onClick={() =>
          alert("Card clicked")
        }
      >
        <h2>
          Clickable Card
        </h2>

        <p>
          Hover me and click
          anywhere.
        </p>
      </Card>
    </div>
  );
}