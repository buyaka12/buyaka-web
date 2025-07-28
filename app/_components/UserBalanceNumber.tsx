import { useAuthentication } from "@/app/feature/authentication/AuthenticationProviderHook";
import { useSpring, animated, useTransition } from '@react-spring/web';
import { useState, useEffect, useRef } from "react";

export function UserBalanceNumber() {
  const { user } = useAuthentication();
  const balance = user?.wallet.balance ?? 0;

  // Ref to store the previous balance to calculate the difference
  const prevBalanceRef = useRef(balance);

  // State to hold the most recent balance change for the transition
  const [diffItem, setDiffItem] = useState<{ amount: number; key: number } | null>(null);

  // Spring for animating the balance number itself
  const { number } = useSpring({
    from: { number: prevBalanceRef.current },
    number: balance,
    config: { duration: 250 },
  });

  // A controllable spring for the color flash effect
  const [flashProps, flashApi] = useSpring(() => ({
    from: { color: '#fff' }, // Default text color
  }));

  const diffTransition = useTransition(diffItem ? [diffItem] : [], {
    from: { opacity: 0, transform: 'translateY(-20px)' },
    enter: { opacity: 1, transform: 'translateY(0)' },
    leave: { opacity: 0, transform: 'translateY(0px)' },
    keys: item => item.key, // This is now safe and will not receive null
  });

  // This effect runs when the balance changes to trigger all animations
  useEffect(() => {
    const change = balance - prevBalanceRef.current;
    if (change !== 0) {
      // 1. Trigger the color flash animation 💥
      flashApi.start({
        from: { color: change > 0 ? '#28a745' : '#dc3545' }, // Green for positive, Red for negative
        to: { color: '#fff' }, // Fade back to default color
        config: { duration: 500 },
      });
      setDiffItem({ amount: change, key: Date.now() });
      const timeoutId = setTimeout(() => setDiffItem(null), 2000);
      prevBalanceRef.current = balance;

      return () => clearTimeout(timeoutId); // Cleanup timer on unmount
    }
  }, [balance, flashApi]);

  if (user === null) return null;

  return (
    // A container to position the main balance and the difference text
    <div style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>

      <animated.span style={{ ...flashProps, fontWeight: 'bold' }}>
        {number.to((n) => n.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }))}
      </animated.span>

      {/* This div positions the animated difference text below the balance */}
      <div style={{ position: 'absolute', bottom: '-22px', fontSize: '0.9em' }}>
        {diffTransition((style, item) =>
          item ? (
            <animated.div style={{ ...style, fontWeight: 'bold', color: item.amount > 0 ? '#28a745' : '#dc3545' }}>
              {item.amount > 0.1 ? '+' : ''}
              { item.amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }) }
            </animated.div>
          ) : null
        )}
      </div>
    </div>
  );
}