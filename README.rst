**************************
Easy Publish Data Services
**************************

Easy Publish Data Services are data services for a Learning Registry node, intended to be used by Easy Publish for 
importing previously published metadata into Easy Publish for editing and replacement into `Learning Registry`_.


Data Services
====================

This data service is built as a `Kanso`_ CouchApp to simplify modularity and development.


Installation
============

1.  Install a `Learning Registry Node`_.

2.  Install `Node.js`_.

3.  Install `Kanso Tools`_.

4.  Clone the GitHub repository locally:
    
    .. code-block:: bash
    
        git clone https://github.com/easypublish/EasyPublish-DataServices.git
        cd EasyPublish-DataServices/ezpublish-submitters


5.  Install Kanso dependencies

    .. code-block:: bash

        kanso install


6.  Create an ssh connection to your `Learning Registry Node`_ ensuring you have a 
    local port forward mapping to the CouchDB on the node.

    .. code-block:: bash

        ssh lradmin@lrdev.local -L8984:localhost:5984


7.  Install Kanso app

    .. code-block:: bash

        kanso push http://localhost:8984/resource_data


8.  Access Easy Publish in your web browser

    .. code-block:: bash

        http://lrdev.local/extract/ezpublish-submitters/resource-by-discriminator


Usage within Easy Publish
=========================

The reccomended way to use this data service is using the following algorithm:

1.  Determine the email address of the submitter.


2.  Discover the node identifier

    .. code-block:: bash

        curl "http://lrdev.local/services"

    It should return a response similar to this:

    .. code-block:: javascript

        {
            "active": true,
            "timestamp": "2013-12-04 05:09:48.665361",
            "node_id": "c8c0bf5288f4497ca683ba3111bc6800",
            "services": [ /* service documents omitted */],
            "node_name": "Node@http://lrdev.local"
        }

    You need the "node_id" property from the response.


3.  Discover what documents the user have been published at this node

    .. code-block:: bash

        curl 'http://lrdev.local/extract/ezpublish-submitters/resource-by-discriminator?ids_only&discriminator=\["c8c0bf5288f4497ca683ba3111bc6800","jim.klo@learningregistry.org"\]'  

    The response will look something like this:

    .. code-block:: javascript

        {
            "documents": [{
                "result_data": {
                    "resource": "http://www.example.com/1",
                    "discriminator": ["c8c0bf5288f4497ca683ba3111bc6800", "jim.klo@learningregistry.org"]
                },
                "resource_data": ["2b76648bd6aa48a0ab2edfa7e0e8d2b7", "a686dfb9246d47d6bb108179d1952277"]
            }, {
                "result_data": {
                    "resource": "http://www.example.com/10",
                    "discriminator": ["c8c0bf5288f4497ca683ba3111bc6800", "jim.klo@learningregistry.org"]
                },
                "resource_data": ["f777643145a945cf81131354dd125d37"]
            }, {
                "result_data": {
                    "resource": "http://www.example.com/2",
                    "discriminator": ["c8c0bf5288f4497ca683ba3111bc6800", "jim.klo@learningregistry.org"]
                },
                "resource_data": ["c0433895e411400bad73235cc523184d"]
            }, {
                "result_data": {
                    "resource": "http://www.example.com/3",
                    "discriminator": ["c8c0bf5288f4497ca683ba3111bc6800", "jim.klo@learningregistry.org"]
                },
                "resource_data": ["4cf30c66b0c241bbbe34948b360afec0"]
            }, {
                "result_data": {
                    "resource": "http://www.example.com/4",
                    "discriminator": ["c8c0bf5288f4497ca683ba3111bc6800", "jim.klo@learningregistry.org"]
                },
                "resource_data": ["9447fce170e14e89869c864cf001d0f1"]
            }, {
                "result_data": {
                    "resource": "http://www.example.com/5",
                    "discriminator": ["c8c0bf5288f4497ca683ba3111bc6800", "jim.klo@learningregistry.org"]
                },
                "resource_data": ["c666aad0157b4dc5bd16d5b14c8717ba"]
            }, {
                "result_data": {
                    "resource": "http://www.example.com/6",
                    "discriminator": ["c8c0bf5288f4497ca683ba3111bc6800", "jim.klo@learningregistry.org"]
                },
                "resource_data": ["c28c7e1b71b44aaa8be8d1b286ce4766"]
            }, {
                "result_data": {
                    "resource": "http://www.example.com/7",
                    "discriminator": ["c8c0bf5288f4497ca683ba3111bc6800", "jim.klo@learningregistry.org"]
                },
                "resource_data": ["f029a1e312484dd28ab45ac70296c193"]
            }, {
                "result_data": {
                    "resource": "http://www.example.com/8",
                    "discriminator": ["c8c0bf5288f4497ca683ba3111bc6800", "jim.klo@learningregistry.org"]
                },
                "resource_data": ["b822257fa637457fa77043d157f60783"]
            }, {
                "result_data": {
                    "resource": "http://www.example.com/9",
                    "discriminator": ["c8c0bf5288f4497ca683ba3111bc6800", "jim.klo@learningregistry.org"]
                },
                "resource_data": ["d3ee1b48d8614054a427316cb8f5815e"]
            }]
        }

    Each of the values withing the "resource_data" properties is a "doc_ID" property for a Learning Registry Envelope.

    More information about data services is available in the `Data Services Tutorial`_.


4.  For each "doc_ID", you can either fetch each one individualy using a GET request using:
    
    .. code-block:: bash

        curl -XGET "http://lrdev.local/obtain?by_doc_ID=true&request_ID=d3ee1b48d8614054a427316cb8f5815e"


    assuming "d3ee1b48d8614054a427316cb8f5815e" is the "doc_ID". Or you can perform bulk operations using a POST request using:

    .. code-block:: bash

        curl -XPOST -H'Content-Type: application/json' "http://lrdev.local/obtain" --data-binary '{"by_doc_ID":true,"request_IDs":["2b76648bd6aa48a0ab2edfa7e0e8d2b7","a686dfb9246d47d6bb108179d1952277"]}'


    where "request_IDs" is a list of "doc_ID". 

    Complete documentation for the Obtain API is available within the `Basic Obtain Service`_ API specification.



.. _Learning Registry: http://learningregistry.org
.. _Learning Registry Node: http://docs.learningregistry.org/en/latest/install/index.html
.. _Kanso: http://kan.so
.. _Kanso Tools: http://kan.so/install
.. _Node.js: http://nodejs.org
.. _Basic Obtain Service: http://docs.learningregistry.org/en/latest/spec/Access_Services/index.html#basic-obtain-service
.. _Data Services Tutorial: http://learningregistry.github.io/LearningRegistry/data-services/index.html


