const Layout = ({link}) => {
    return (
      <>
      {
        link?
          <iframe className='iframe' src={link} allowFullScreen={true} width="600" height="373.5"></iframe>
        :<div className="dataPlaceholder">DASHBOARD COMING SOON!</div>
      }
      </>
    );
}
 
export default Layout;