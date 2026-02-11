export const Home = () => {
  const links = [
    {
      name: 'Clinic',
      location: '/clinic/login',
    },
    {
      name: 'Patient',
      location: '/patient/login',
    },
  ];

  return (
    <div style={{display:'flex', justifyContent:'space-around'}}>
      {links.map((link) => (
        <a
          href={link.location}
          style={{
            border: '1px solid black',
            width: '30%',
            textAlign: 'center',
            cursor: 'pointer',
          }}
        >
          <h1>{link.name}</h1>
        </a>
      ))}
    </div>
  );
};
