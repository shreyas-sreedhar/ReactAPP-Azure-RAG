import React from 'react';

function DomainTable({ selectedDomainData }) {
  console.log(selectedDomainData+"sdfsdjkfhadsjkfh")
  console.log("dlfkjnsdkjfng")
    return (
        <div>
            <h3>Domain Table</h3>
            <table>
                <thead>
                    <tr>
                        <th>Domain</th>
                        <th>File Name</th>
                        <th>File Path</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedDomainData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.domain}</td>
                            <td>{item.file_name}</td>
                            <td>{item.file_path}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DomainTable;
